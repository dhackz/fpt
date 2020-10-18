
let crypto = require("crypto");
const sessions = {};
const lobbies = {};
let counter = 1;
let redis, rsub, rpub;
let log;

let redisHandler;

let initSessionHandler = (r, s, p, l) => {
    redis = r;
    rsub = s;
    rpub = p;
    log = l;
    rsub.on("message", handleMessageBus);
    redisHandler = new RedisHandler(r,s,p,l)
}

/**
 * RedisHandler:
 * The purpose of RedisHandler is to act as an interface to the Redis DB and
 * expose access to objects and possible actions on those objects.
 */
class RedisHandler {
    redis;
    rsub;
    rpub;
    log;

    constructor(r, s, p, log) {
        this.redis = r;
        this.rsub = s;
        this.rpub = p;
        this.log = log;
        //this.rsub.on("message", handleMessageBus);
    }

    async numOfPlayers(sessionId: string) {
        let sessionKey = "session:" + sessionId;
        let playersKey = sessionKey + ":players"

        return this.redis.llen(playersKey);
    }

    async addPlayer(sessionId, playerName) {
        let sessionKey = "session:" + sessionId;
        let playersKey = sessionKey + ":players"

        log.warn("AAAAA "+ playersKey +" "+ playerName);
        await this.redis.lpush(playersKey, playerName);
    }
}

let handleJoinLobby = (sessionId, playerName) => {
    redisHandler.numOfPlayers(sessionId).then((num) => {
        log.debug("Number of players in lobby? " + num);

        if (num < 4) {
            return redisHandler.addPlayer(sessionId, playerName);
        } else {
            return "DENY " + playerName;
        }
    });
}

let handleMessageBus = (channel, message) => {
    log.info("Received message "+message+" from channel "+channel)
    let [_session, sessionId, _channels, to] = channel.split(":"); 
    let [request, data] = message.split(" ");
    // log.debug(sessionId, to, request, data)
    switch (request) {
        case "JOIN":
            handleJoinLobby(sessionId, data);
                // .then((response) => {
                // rpub.publish("session:" + sessionId + ":channels:clients", response);
            // });
    }
}

let getSessionIdFromLobbyId = (lobbyId: string, redis) => {
    if (!(lobbyId in lobbies)) {
        redis.get("lobby:"+ lobbyId).then((result) => {
            lobbies[lobbyId] = { id: result};
            //return lobbies[lobbyId].id;
        });
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
    redis.set(gameKey, json.game, (err) => {
        if (err) {
            log.warn("Failed to set() redis key=\""+gameKey+"\", with value=\""+json.game+"\".")
        }
    });

    let lobbyKey    = "lobby:" + lobbyId;
    redis.set(lobbyKey, sessionId, (err) => {
        if (err) {
            log.warn("Failed to set key=\""+lobbyKey+"\", with value=\""+sessionId+"\", in Redis.")
        }
    });
    redis.lpush("sessions", sessionId, (err, result) => {
        if (err) {
            log.warn("err: "+err)
            log.warn("count: "+result)
        }
    });

    sessions[sessionId] = {
        "game": json.game,
        "players": {}
    }

    lobbies[lobbyId] = {
        "id": sessionId,
    }

    rsub.subscribe(sessionKey + ":channels:server", (err, count) => {
        if (err) {
            log.warn("err: " + err)
            log.warn("count: " + count)
        }
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
        let sessionKey: string = "session:" + session_id;

        rsub.subscribe(sessionKey + ":channels:clients", (err, count) => {
            if (err) {
                log.warn("err: " + err);
                log.warn("count: " + count);
            }
        });
        let joinMessage = "JOIN " + name
        rpub.publish(sessionKey + ":channels:server", joinMessage);
        log.warn("Sending on RPUB: "+joinMessage+" "+sessionKey+":channels:server")
        return {
            session_id,
            'players': Object.keys(session.players),
            'playerName': name
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
