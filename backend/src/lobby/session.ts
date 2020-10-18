let crypto = require("crypto");
const sessions = {};
const lobbies = {};
let counter = 1;
let redis, rsub, rpub;

let initSessionHandler = (r, s, p) => {
    redis = r;
    rsub = s;
    rpub = p;
    rsub.on("message", handleMessageBus);
}

let handleJoinLobby = (sessionId, playerName, log) => {
    let sessionKey = "session:" + sessionId;
    let playersKey = sessionKey + ":players"
    log.debug(playersKey);
    return redis.llen(playersKey).then((numPlayers) =>{
        log.debug(numPlayers, typeof(numPlayers));
        if (numPlayers < 4) {
            redis.lpush(playersKey, playerName);
            return "OK " + playerName;
        } else {
            return "DENY " + playerName;
        }
    }).catch((error) => {return "DENY " + playerName;});
}

let handleMessageBus = (channel, message, log) => {
    log.info("Received message "+message+" from channel "+channel)
    let [_session, sessionId, _channels, to] = channel.split(":"); 
    let [request, data] = message.split(" ");
    log.debug(sessionId, to, request, data)
    switch (request) {
        case "JOIN":
            handleJoinLobby(sessionId, data, log).then((response) => {
                rpub.publish("session:" + sessionId + ":channels:clients", response);
            });
    }
}

let getSessionIdFromLobbyId = (lobbyId, redis) => {
    if (!(lobbyId in lobbies)) {
        lobbies[lobbyId] = {"id": redis.get("lobby:"+ lobbyId)};
    }
    return lobbies[lobbyId].id;
}

let getSession = (sessionId, redis) => {
    if (!(sessionId in sessions)) {
        let sessionKey = "session:" + sessionId;
        let players = redis.get(sessionKey + "players");
        let game = redis.get(sessionKey + "game");
        sessions[sessionId] = {"players": players, "game": game};
    }
    return sessions[sessionId];
}

let createLobby = (json, redis, rsub, log) => {
    const FUNC_NAME = "createLobby";

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
    redis.set(gameKey, json.game);

    let lobbyKey    = "lobby:" + lobbyId;
    redis.set(lobbyKey, sessionId, (err, count) => {
        log.warn("err: "+err)
        log.warn("count: "+count)
    });
    redis.lpush("sessions", sessionId, (err, count) => {
        log.warn("err: "+err)
        log.warn("count: "+count)
    });

    sessions[sessionId] = {
        "game": json.game,
        "players": {}
    }

    lobbies[lobbyId] = {
        "id": sessionId,
    }

    rsub.subscribe(sessionKey + ":channels:server", (err, count) => {
        log.warn("err: " + err)
        log.warn("count: " + count)
    });

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
let joinLobby = (json, redis, rsub, rpub, log) => {
    log.debug(json);
    if(json.name) {
        let session_id = getSessionIdFromLobbyId(json.joinCode, redis)
        if(!session_id) {
            return {'error': "NO_SUCH_LOBBY"}
        }
        let session = getSession(session_id, redis);

        let name = uniquePlayerName(json.name, Object.keys(session.players))
        log.info("Player "+name+" joined, "+Object.keys(session.players).length+" in lobby "+json.joinCode);
        let sessionKey = "session:" + session_id;

        rsub.subscribe(sessionKey + ":channels:clients", (err, count) => {
            log.warn("err: " + err);
            log.warn("count: " + count);
        });
        let joinMessage = "JOIN " + name
        rpub.publish(sessionKey + ":channels:server", joinMessage);
        return {
            session_id,
            'players': Object.keys(session.players),
            'player_name': name
        }
    } else {
        return {'error': "NO_NAME_PROVIDED"}
    }
}

let startGame = (json, redis, log) => {
    if(json.joinCode) {
        log.info("Game "+json.joinCode+" is starting");
        return {
            ok: delete lobbies[json.joinCode]
        }
    }
    return { ok: false }
}
export {sessions, initSessionHandler, createLobby, joinLobby, startGame, handleMessageBus};
