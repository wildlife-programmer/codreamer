local nk = require("nakama")
local tInsert = table.insert
local osTime = os.time
local osDate = os.date
local jsonEncode = nk.json_encode
local jsonDecode = nk.json_decode

local matchList = nk.match_list
local matchCreate = nk.match_create

local storageRead = nk.storage_read
local storageWrite = nk.storage_write

local registerRpc = nk.register_rpc
local runOnce = nk.run_once

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

local function initialize()
    -- create_storage()
    match_create()
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
                    date = date
                }
            }
        }
    else
        local messages = objects[1].value.messages
        tInsert(messages, {
            name = decoded["name"],
            message = decoded["message"],
            date = date
        })
        storage_config[1].value = {messages = messages}
    end
    local success = pcall(storageWrite, storage_config)
    return jsonEncode({success = success})
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

-- nk.register_req_before(authenticate_before, "AuthenticateCustom")
