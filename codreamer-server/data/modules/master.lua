local nk = require("nakama");
local M = {}

local jsonEncode = nk.json_encode
local jsonDecode = nk.json_decode
local tInsert = table.insert

local OP_WORLD_STATE = 1
local OP_PLAYER_SPAWN = 2
local OP_PLAYER_MOVE = 3

local function on_player_spawn(context, dispatcher, tick, state, message)
    local player = state.players[message.sender.session_id]
    if not player then return end

    local decoded = jsonDecode(message.data);
    decoded["user_id"] = player.user_id
    print("on player spawn", jsonEncode(decoded))
    dispatcher.broadcast_message_deferred(OP_PLAYER_SPAWN, jsonEncode(decoded),
                                          nil)
end

local function on_player_move(context, dispatcher, tick, state, message)
    local player = state.players[message.sender.session_id]
    if not player then return end

    local decoded = jsonDecode(message.data)
    decoded["user_id"] = player.user_id
    local playerInfo = player.info
    playerInfo.pos = decoded['pos']

    dispatcher.broadcast_message_deferred(OP_PLAYER_MOVE, jsonEncode(decoded),
                                          nil)
end

local message_table = {
    [OP_PLAYER_SPAWN] = on_player_spawn,
    [OP_PLAYER_MOVE] = on_player_move
}

function M.match_init(context, setupstate)
    local gamestate = {players = {}, player_count = 0}
    local tickrate = 30
    local label = ""
    return gamestate, tickrate, label
end

function M.match_join_attempt(context, dispatcher, tick, state, presence,
                              metadata)
    local acceptuser = true
    return state, acceptuser
end

function M.match_join(context, dispatcher, tick, state, presences)
    nk.logger_info("presences", jsonEncode(presences))
    for _, presence in ipairs(presences) do
        local player = presence
        player.info = {pos = {0, 0, 0}, user_id = presence.user_id}
        state.players[presence.session_id] = player
        state.player_count = state.player_count + 1;
    end
    local players = {}
    if state.player_count > 0 then
        for k, v in pairs(state.players) do tInsert(players, v) end
    end
    local worldState = {players = players}
    dispatcher.broadcast_message_deferred(OP_WORLD_STATE,
                                          jsonEncode(worldState), presences)
    return state
end
function M.match_leave(context, dispatcher, tick, state, presences)
    for _, presence in ipairs(presences) do
        state.players[presence.session_id] = nil
        state.player_count = state.player_count - 1;
    end
    return state
end
function M.match_loop(context, dispatcher, tick, state, messages)
    if #messages > 0 then
        for _, m in ipairs(messages) do
            message_table[m.op_code](context, dispatcher, tick, state, m);
        end
    end
    return state
end
function M.match_terminate(context, dispatcher, tick, state, grace_seconds)
    return nil
end
function M.match_signal(context, dispatcher, tick, state, data)
    return state, "signal received" .. data
end

return M
