import React, { useEffect, useState } from 'react';
import Sockette from 'sockette';
import axios from 'axios';
import useGameState from '../../hooks/useGameState';
import * as Styled from './styles';
import {newSocketListener} from '../../tools/socket';

const Lobby = () => {
  const joinCode = window.location.pathname.split('/')[2];
  const {role, setLobbySocket, session, playerName, setPlayerName} = useGameState()
  const [players, setPlayers] = useState<String[]>([]);
  const onMessage = (ws: Sockette, message: MessageEvent) => {
    message.preventDefault();
    const json = JSON.parse(message.data);
    console.log("got a message!, ", json);
    if (json.error) {
      console.log('WebSocket error: %s', json.error);
      return;
    }
    if (json.connected) {
      ws.json({
        actor: role,
        action: 'register',
        sessionId: session,
        name: playerName
      })
      console.log("sending register to session");
    }
    if(json.message) {
      console.log("we joined the game")
      if(json.message.playerName) {
        setPlayerName(json.message.playerName); 
        setPlayers([...players,json.message.playerName]);
      }
    }
    if(json.newPlayer) {
      console.log("a new player joined: ", json.newPlayer);
      console.log("players was: ", players);
      console.log("all players are now: ", [...players, json.newPlayer ]);
      setPlayers([...players, json.newPlayer ]);
    }
  };

  useEffect(()=>{
    console.log("players was changed", players)
  },[players])

  useEffect(() => {
    newSocketListener(onMessage);
  }, []);

  const startGame = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/api/lobby/start';
    const response = await axios.post(
      url,
      { joinCode },
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.data.ok) {
      console.log('Starting game');
    } else {
      console.log('Unable to start game');
    }
  };

  const title = 'Secret Mussolini';

  return role === 'server' ? (
    <Styled.Fullscreen>
      <div
        style={{
          borderRadius: '50%',
          backgroundColor: 'white',
          width: '40vw',
          height: '40vw',
          position: 'fixed',
          top: '50%',
          left: '50%',
          WebkitTransform: 'translate(-50%, -50%)',
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div
        style={{
          color: 'white',
          position: 'absolute',
          top: '10rem',
          left: '6rem',
          fontSize: '60px',
          transform: 'rotate(-20deg)'
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: 'white',
          position: 'absolute',
          top: '10rem',
          right: '6rem',
          fontSize: '48px',
          transform: 'rotate(20deg)'
        }}
      >
        Join code: {joinCode}
      </div>
      {players}
      <button onClick={startGame}>Start game</button>
    </Styled.Fullscreen>
  ) : (
    <>
      <div>{title}</div>
      <div>Join code: {joinCode}</div>
      <div>Waiting for host to start game...</div>
      <p>You are: {playerName}</p>
      {players}
    </>
  );
};

export default Lobby;
