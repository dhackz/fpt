var crypto = require("crypto");
const sessions = {};
const lobbies = {};
var counter = 1;

var createLobby = (json) => {
    var id = crypto.createHash("sha256")
                   .update(""+counter)
                   .digest("base64");
    counter += 1;

    var join_code = id.replace("/", "")
                      .replace("=", "")
                      .replace("+", "")
                      .substring(0,4);

    var socket = 'socket:of:doom';

    sessions[id] = {
        "game" : json.game,
        "socket" : socket,
        "players" : {}
    }
    lobbies[join_code] = {
        "id" : id,
    }

    return {
        'session_id': id,
        'socket_info': socket,
        'join_code': join_code,
    };
}

var uniquePlayerName = (original_name, players) => {
    var name = original_name;
    while(players.includes(name)){
        var suffix_counter = suffix_counter? suffix_counter+1 : 2;
        name = original_name + suffix_counter;
    }
    return name;
}
var joinLobby = (json) => {
    if(lobbies[json.join_code]) {
        if(json.name) {
            var session_id = lobbies[json.join_code].id
            if(!session_id) {
                return {'error': "NO_SUCH_LOBBY"}
            }
            var session = sessions[session_id]

            var name = uniquePlayerName(json.name, Object.keys(session.players))
            session.players[name] = "socket:for:"+name
            console.log("Player %s joined, %d in lobby %s", name, Object.keys(session.players).length, json.join_code);
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
export {session, createLobby, joinLobby};
