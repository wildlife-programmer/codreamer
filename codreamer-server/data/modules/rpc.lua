local nk = require("nakama")
local jsonEncode = nk.json_encode
local jsonDecode = nk.json_decode

local matchList = nk.match_list
local matchCreate = nk.match_create

local storageRead = nk.storage_read
local storageWrite = nk.storage_write

local registerRpc = nk.register_rpc
local runOnce = nk.run_once

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

local function create_storage()
    local config_1 = {{collection = "guestbook", key = "guestbook"}}
    local objects_1 = storageRead(config_1);
    if #objects_1 <= 0 then
        config_1[1].value = {comments = {}}
        storageWrite(config_1)
    end
end

local function get_guestbook()
    local config_1 = {{collection = "guestbook", key = "guestbook"}}
    local objects_1 = storageRead(config_1);
    if #objects_1 > 0 then return jsonEncode(objects_1[1].value) end
end

runOnce(create_storage)

registerRpc(match_join, "match_join")
registerRpc(match_create, "match_create")
registerRpc(get_guestbook, "get_guestbook")

