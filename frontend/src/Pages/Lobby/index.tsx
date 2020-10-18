import React, { useEffect } from 'react';
import axios from 'axios';
import Sockette from 'sockette';
import useGameState from '../../hooks/useGameState';
import * as Styled from './styles';

const Lobby = () => {
  const joinCode = window.location.pathname.split('/')[2];

  const {role, setLobbySocket, session, players, setPlayersList, playerName, setPlayerName} = useGameState()

  const onMessage = (ws: Sockette, message: MessageEvent) => {
    console.log(message.data);
    const json = JSON.parse(message.data);
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
    }
    if(json.message) {
      if(json.message.playerName) {
        setPlayerName(json.message.playerName);
      }
      if(json.message.players) {
        setPlayersList(json.message.players);
      }
    }
  };

  useEffect(() => {
    const ws: Sockette = new Sockette('ws://localhost:8080', {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: (e: Event) => () => {
        console.log('Connected!', e);
      },
      onmessage: e => onMessage(ws, e),
      onreconnect: e => console.log('Reconnecting...', e),
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => console.log('Closed!', e),
      onerror: e => console.log('Error:', e)
    });

    setLobbySocket(ws);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
