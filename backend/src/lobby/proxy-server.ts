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
let createProxy = (server, redis) => {
  const wss = new WebSocket.Server({ server });

  async function gameServerUpdate(ws, message) {
    if (!(await redis.exists("session:" + message.sessionId))) {
      const error = "No such sessionId exists: " + message.sessionId;
      ws.send(JSON.stringify({ error }));
      console.log("proxy: " + error);
      return;
    }

    // There should already be a valid session.
    let session = await redis.get("session:" + message.sessionId);
    console.log("proxy: session found, " + session);
    switch (message.action) {
      case "register":
        proxySessions[message.sessionId] = {
          host: ws,
          players: {},
        };
        break;
      case "sendAll":
        break;
      case "sendTo":
        break;
      default:
        const error = `Invalid action: ${message}! Closing socket.`;
        console.log("proxy: " + error);
        ws.send(JSON.stringify({ error }));
        ws.close();
        break;
    }
  }

  async function gameClientUpdate(ws: WebSocket, message) {
    if (!(await redis.exists("session:" + message.sessionId))) {
      const error = "No such sessionId exists: " + message.sessionId;
      ws.send(JSON.stringify({ error }));
      console.log("proxy: " + error);
      return;
    }

    console.log("found session..");

    // There should already be a valid session.
    let session = await redis.get("session:" + message.sessionId);
    console.log("proxy: " + session);
    switch (message.action) {
      case "register":
        ws.send(
          JSON.stringify({
            message: { players: [message.name], playerName: message.name },
          })
        );
        proxySessions[message.sessionId].players[message.name] = ws;
        break;
      case "sendAll":
        break;
      case "sendTo":
        break;
      default:
        const error = `Invalid action: ${message.action}! Closing socket.`;
        console.log("proxy: " + error);
        ws.send(JSON.stringify({ error }));
        break;
    }
  }

  wss.on("listening", () => {
    const addressInfo = wss.address();
    console.log(
      "proxy: Proxy server started. Listening on ws://%s:%s",
      addressInfo["address"],
      addressInfo["port"]
    );
  });

  wss.on("connection", (ws, req) => {
    console.log("proxy: New client connected!");
    ws.send(JSON.stringify({ connected: true }));
    ws.on("message", (data: string) => {
      console.log("proxy: " + data);

      //TODO(dawidstrom): validate JSON data format.
      var message = JSON.parse(data);

      if (message.actor == "client") {
        gameClientUpdate(ws, message);
      } else if (message.actor == "server") {
        gameServerUpdate(ws, message);
      } else {
        console.log("proxy: Who tf is this?");
      }

      console.log("proxy: New connection established!");
    });
  });
};

export { createProxy, channelPusher, onChannelMessage };
