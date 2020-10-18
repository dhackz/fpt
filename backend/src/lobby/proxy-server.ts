import * as WebSocket from "ws";

const proxySessions = {};

const sendToAllSocketsInSession = (sessionId: string, message: string) => {
  if (proxySessions[sessionId]) {
    let session = proxySessions[sessionId];
    if (session.host) {
      session.host.send(message);
    }
    if (session.players) {
      Object.keys(session.players).forEach((player) => {
        session.players[player].send(message);
      });
    }
  }
};

const onChannelMessage = (sessionId: string, message: string) => {
  let json = JSON.parse(message);
  if (json) {
    switch (json.type) {
      case "PJOIN": // playerjoin
        sendToAllSocketsInSession(
          sessionId,
          JSON.stringify({ newPlayer: json.message })
        );
    }
  }
};
const channelPusher = (rpub) => {
  const publisher = rpub;
  const pushToChannel = (channel: string, message: string) => {
    console.log("proxy: Pushing to %s message: %s", channel, message);
  };
};

let createProxy = (server, redis, log) => {
  const wss = new WebSocket.Server({server});

  let sessionExists = async (sessionId) => {
    log.debug("Asking Redis if session:"+sessionId+" exists...");
    if (await redis.exists('session:'+sessionId)) {
      log.debug("session:"+sessionId+" found in redis.");
      return true;
    }
    log.debug("session:"+sessionId+" found in redis.");
    return false;
  }

  async function gameServerUpdate(ws, message) {
    if (!sessionExists(message.sessionId)) {
      const error = "No such sessionId exists: " + message.sessionId;
      ws.send(JSON.stringify({error}));
    }

    // There should already be a valid session.
    let session = await redis.get('session:'+message.sessionId);
    log.debug("Result fetched session with id session: "+session);

    switch (message.action) {
      case 'register':
        break;
      case 'sendAll':
        break;
      case 'sendTo':
        break;
      default:
        const error = `Invalid action: ${message}! Closing socket.`;
        log.debug("session: "+session);
        ws.send(JSON.stringify({error}));
        ws.close()
        break
    }
  }
}

async function gameClientUpdate(ws: WebSocket, message) {
  let FUNC_NAME="gameClientUpdate";

  if (!sessionExists(message.sessionId)) {
    const error = "No such sessionId exists: " + message.sessionId;
    ws.send(JSON.stringify({error}));
  }

  // There should already be a valid session.
  let session = await redis.get('session:'+message.sessionId);
  log.debug("Result fetched session with id session: "+session);

  switch (message.action) {
    case 'register':
      ws.send(JSON.stringify({message:{players:[message.name], playerName:message.name}}))
      break;
    case 'sendAll':
      break;
    case 'sendTo':
      break;
    default:
      const error = `Invalid action: ${message.action}! Closing socket.`;
      log.warn(error)
      ws.send(JSON.stringify({error}));
      break
  }
}

wss.on('listening', () => {
  const addressInfo = wss.address();
  log.info("Proxy server started. Listening on ws://"+addressInfo['address']+":"+addressInfo['port'])
})

wss.on('connection', (ws,req) => {
  log.info("New client connected!")
  ws.send(JSON.stringify({connected:true}));

  ws.on('message', (data: string) => {
    let FUNC_NAME = "message";
    log.debug("data: "+data)

    //TODO(dawidstrom): validate JSON data format.
    var message = JSON.parse(data);

    if (message.actor == "client") {
      gameClientUpdate(ws, message);
    } else if (message.actor == "server") {
      gameServerUpdate(ws, message);
    } else {
      log.error("Who tf is this?")
    }

    log.info("New connection established!");
  })
})

export { createProxy, channelPusher, onChannelMessage };
