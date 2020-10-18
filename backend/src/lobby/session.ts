let crypto = require("crypto");
const sessions = {};
const lobbies = {};
let counter = 1;

let createLobby = (json, tedis) => {
    let sessionId = crypto.createHash("sha256")
                   .update(""+counter)
                   .digest("base64");
    counter += 1;

    let lobbyId = sessionId.replace("/", "")
                      .replace("=", "")
                      .replace("+", "")
                      .substring(0,4);

    let sessionKey  = "session:" + sessionId;
    let playersKey  = sessionKey + ":players";
    let gameKey     = sessionKey + ":game";
    tedis.set(gameKey, "game", json.game);

    let lobbyKey    = "lobby:" + lobbyId;
    tedis.set(lobbyKey, sessionId);
    tedis.lpush("sessions", sessionId);

    sessions[sessionId] = {
        "game": json.game,
        "players": {}
    }

    lobbies[lobbyId] = {
        "id": sessionId,
    }

    return {
        'session_id': sessionId,
        'join_code': lobbyId,
    };
}

let uniquePlayerName = (original_name, players) => {
    var name = original_name;
    while(players.includes(name)){
        var suffix_counter = suffix_counter? suffix_counter+1 : 2;
        name = original_name + suffix_counter;
    }
    return name;
}
let joinLobby = (json, tedis) => {
    if(lobbies[json.joinCode]) {
        if(json.name) {
            let session_id = lobbies[json.joinCode].id
            if(!session_id) {
                return {'error': "NO_SUCH_LOBBY"}
            }
            let session = sessions[session_id]

            let name = uniquePlayerName(json.name, Object.keys(session.players))
            session.players[name] = "socket:for:"+name
            console.log("Player %s joined, %d in lobby %s", name, Object.keys(session.players).length, json.joinCode);
            return {
                session_id,
                'socket_info': session.socket,
                'players': Object.keys(session.players),
                'player_name': name
            }
        } else {
            return {'error': "NO_NAME_PROVIDED"}
        }
    } else {
        return {'error': 'NO_SESSION_FOUND'}
    }
}

let startGame = (json, tedis) => {
    if(json.joinCode) {
        console.log("Game %s is starting", json.joinCode);
        return {
            ok: delete lobbies[json.joinCode]
        }
    }
    return { ok: false }
}
export {sessions, createLobby, joinLobby, startGame};
