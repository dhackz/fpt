
import React, { useEffect } from 'react';
import axios from 'axios'
import Sockette from 'sockette';
import useGameState from "../../hooks/useGameState";

const Lobby = () => {
  const joinCode = window.location.pathname.split("/")[2];

  const {role, setLobbySocket, session, socket} = useGameState()

  const onMessage = (ws: Sockette, message: MessageEvent) => {
    console.log(message.data);
    const json = JSON.parse(message.data);
    if (json.error) {
      console.log("WebSocket error: %s", json.error);
      return;
    }
    if(json.connected) {
      ws.json({
        actor: role,
        action: 'register',
        sessionId: session,
      })
    }
  };

  useEffect(() => {
    const ws: Sockette = new Sockette('ws://localhost:8080' , {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: (e: Event) => () => {
        console.log('Connected!', e)
      },
      onmessage: (e) => onMessage(ws,e),
      onreconnect: e => console.log('Reconnecting...', e),
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => console.log('Closed!', e),
      onerror: e => console.log('Error:', e),
    });

    setLobbySocket(ws);
   
  }, [])

  useEffect(()=>{console.log("role", role)},[role])

  const startGame = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/api/lobby/start"
    const response = await axios.post(url, {join_code: joinCode}, {headers: { 'Content-Type': "application/json"}})
    if(response.data.ok){
      console.log("Starting game");
    }else {
      console.log("Unable to start game");
    }
  }

  return (
    <>
        <div>Welcome to the lobby</div>
        <div>To join, enter code: {joinCode}</div>
        {role === "server" ? <button onClick={startGame}>Start game</button> : <div>Waiting for host to start game...</div> }
        

    </>
  );
}

export default Lobby;
