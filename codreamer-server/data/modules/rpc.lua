local nk = require("nakama")
-- require("cached_nk")

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
        print("@@@@ searched match", jsonEncode(matches[1]))
        match_id = matches[1].match_id
    end

    return match_id
end

registerRpc(match_join, "match_join")
registerRpc(match_create, "match_create")

