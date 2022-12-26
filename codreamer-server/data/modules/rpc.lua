local nk = require("nakama")
local tInsert = table.insert
local osTime = os.time
local osDate = os.date
local jsonEncode = nk.json_encode
local jsonDecode = nk.json_decode

local accountGetId = nk.account_get_id

local matchList = nk.match_list
local matchCreate = nk.match_create

local storageRead = nk.storage_read
local storageWrite = nk.storage_write

local registerRpc = nk.register_rpc
local runOnce = nk.run_once

local leaderboardCreate = nk.leaderboard_create
local leaderboardRecordWrite = nk.leaderboard_record_write
local leaderboardRecordsList = nk.leaderboard_records_list

local sqlQuery = nk.sql_query
local httpRequest = nk.http_request

local function match_join(context, payload)
    local packed = {success = true}
    return jsonEncode({packed})
end

local function match_create(context, payload)
    local match_id = ""

    local limit = 1
    local authoritative = true
    local label = nil
    local min_size = 0
    local max_size = 3

    local matches = matchList(limit, authoritative, label, min_size, max_size)
    if #matches <= 0 then
        local module_name = "master"
        match_id = matchCreate(module_name)
    else
        match_id = matches[1].match_id
    end

    return match_id
end

local function get_spaces(context, payload)
    local limit = 100
    local authoritative = true
    local label = nil
    local min_size = 0
    local max_size = 10000
    local matches = matchList(limit, authoritative, label, min_size, max_size)
    return jsonEncode(matches)
end

local function create_storage()
    local config_1 = {{collection = "guestbook", key = "guestbook"}}
    local objects_1 = storageRead(config_1);
    if #objects_1 <= 0 then
        config_1[1].value = {comments = {}}
        storageWrite(config_1)
    end
end

local function leaderboard_create()
    local ids = {
        "climb", "speed_click_3", "speed_click_4", "speed_click_5",
        "speed_click_6"
    }
    local authoritative = false
    local sort = "asc"
    local operator = "best"

    for _, id in ipairs(ids) do
        leaderboardCreate(id, authoritative, sort, operator)
    end

end
local function initialize()
    -- create_storage()
    match_create()
    leaderboard_create()
end

local function get_guestbook()
    local query =
        [[select value from storage where collection = 'guestbook' and key = 'guestbook']]
    local rows = sqlQuery(query, {})
    if #rows > 0 then return jsonEncode(rows) end
end

local function add_guest_message(context, payload)
    local current_time = osTime() + 32400
    local date = osDate("%Y.%m.%d %H:%M", current_time)
    local decoded = jsonDecode(payload)
    local user_id = context.user_id
    local storage_config = {
        {collection = "guestbook", key = "guestbook", user_id = user_id}
    }
    local objects = storageRead(storage_config)
    if #objects <= 0 then
        storage_config[1].value = {
            messages = {
                {
                    name = decoded["name"],
                    message = decoded["message"],
                    date = date,
                    create_time = osTime() + 32400
                }
            }
        }
    else
        local messages = objects[1].value.messages
        tInsert(messages, {
            name = decoded["name"],
            message = decoded["message"],
            date = date,
            create_time = osTime() + 32400
        })
        storage_config[1].value = {messages = messages}
    end
    local success = pcall(storageWrite, storage_config)
    return jsonEncode({success = success})
end

local function get_developer(context, payload)
    local config = {{collection = "contents", key = "developer"}}
    local storage = storageRead(config)
    if #storage > 0 then
        local value = storage[1].value
        local developer = value[payload]
        if developer ~= nil then
            return jsonEncode({developer = developer})
        end
    end
end

local function set_leaderboard(context, payload)
    local decoded = jsonDecode(payload)
    if decoded['record'] == nil then return end
    local game = decoded["game"]
    local account = accountGetId(context.user_id)
    local username = account.user.username
    local record = tonumber(decoded["record"]) * 1000

    local success;
    if game == 'climb' then
        success = pcall(leaderboardRecordWrite, decoded["game"],
                        context.user_id, username, record)
    elseif game == "speed_click" then
        success = pcall(leaderboardRecordWrite,
                        decoded["game"] .. "_" .. decoded["stage"],
                        context.user_id, username, record)

    end
    if success then
        local stats_config = {
            {collection = "statistics", key = decoded["game"]}
        }
        local stats = storageRead(stats_config)
        if #stats > 0 then
            local count = stats[1].value.play_count
            stats[1].value.play_count = count + 1
            local success_2 = pcall(storageWrite, stats)
            if not success_2 then
                nk.logger_warn(string.format("Update Count Error"))
            end
        else
            local value = {play_count = 1}
            stats_config[1].value = value
            local success_2 = pcall(storageWrite, stats_config)
            if not success_2 then
                nk.logger_warn(string.format("Create Count Error"))
            end
        end
    end
end

local function get_leaderboard(context, payload)
    local decoded = jsonDecode(payload)
    local game = decoded["game"]
    local id = "";
    if game == "climb" then
        id = game
    elseif game == "speed_click" then
        local stage = decoded['stage']
        id = game .. "_" .. stage
    end

    local owners = {context.user_id}
    local account = accountGetId(context.user_id)

    local success, records, owner_records =
        pcall(leaderboardRecordsList, id, owners, 100)

    return jsonEncode({records = records, owner_records = owner_records})
end

local function get_playcount(context, payload)
    local decoded = jsonDecode(payload)
    local game = decoded["game"]
    local config;
    if game == "climb" then
        config = {{collection = "statistics", key = game}}
    elseif game == "speed_click" then
        local stage = decoded['stage']
        config = {{collection = "statistics", key = game}}
    end

    local stats = storageRead(config)
    if #stats > 0 then
        local count = stats[1].value.play_count
        return jsonEncode({play_count = count})
    end
end

-- local function authenticate_before(context, payload)
--     local account = payload.account
--     if account == nil then return end
--     local user_id = payload.account.id
--     return payload -- important!
-- end

runOnce(initialize)

registerRpc(match_join, "match_join")
registerRpc(match_create, "match_create")
registerRpc(get_spaces, "get_spaces")
registerRpc(get_guestbook, "get_guestbook")
registerRpc(add_guest_message, "add_guest_message");

registerRpc(get_developer, 'get_developer')
-- Climb Game
registerRpc(set_leaderboard, "set_leaderboard");
registerRpc(get_leaderboard, "get_leaderboard");
registerRpc(get_playcount, "get_playcount")

-- nk.register_req_before(authenticate_before, "AuthenticateCustom")
