import React, { useEffect, useRef } from 'react';
import Sockette from 'sockette';
import axios from 'axios';
import useGameState from '../../hooks/useGameState';
import * as Styled from './styles';
import Spinner from '../../Components/Spinner';
import {newSocketListener} from '../../tools/socket';

const Lobby = () => {
  const joinCode = window.location.pathname.split('/')[2];
  const { role, setLobbySocket, session, playerName, setPlayerName } = useGameState();
  const players = useRef<Array<String>>([]);
  const onMessage = (ws: Sockette, message: MessageEvent) => {
    message.preventDefault();
    const json = JSON.parse(message.data);
    console.log('got a message!, ', json);
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
      });
      console.log('sending register to session');
    }
    if (json.message) {
      console.log('we joined the game');
      if (json.message.playerName) {
        setPlayerName(json.message.playerName);
        players.current = [...players.current, json.message.playerName];
      }
    }
    if (json.newPlayer) {
      console.log('a new player joined: ', json.newPlayer);
      console.log('players was: ', players.current);
      console.log('all players are now: ', [...players.current, json.newPlayer]);
      players.current = [...players.current, json.newPlayer];
    }
  };

  useEffect(() => {
    let websocketUrl = window.location.host
    if(window.location.protocol == 'https:') {
      websocketUrl = 'wss://' + websocketUrl
    } else {
      websocketUrl = 'ws://' + websocketUrl
    }

    const ws: Sockette = new Sockette(websocketUrl + "/api/socket/" + session, {
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

  useEffect(() => {
    newSocketListener(onMessage);
  }, []);

  const startGame = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const url = window.location.origin + '/api/lobby/start';
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
    <>
      <Styled.Fullscreen>
        <Styled.BackgroundCircle />
        <Styled.HostTitle>{title}</Styled.HostTitle>
        <Styled.HostCode>Join code: {joinCode}</Styled.HostCode>
        <Styled.StartButton onClick={startGame}>Start game</Styled.StartButton>
      </Styled.Fullscreen>
    </>
  ) : (
    <Styled.Fullscreen>
      <Styled.BackgroundCircle />
      <Styled.ClientText>{title}</Styled.ClientText>
      <Styled.ClientText>Join code: {joinCode}</Styled.ClientText>
      <div style={{ width: '100%', marginBottom: '2vw', position: 'absolute', bottom: 0 }}>
        <Styled.SmallText>Waiting for host to start game...</Styled.SmallText>
        <Spinner />
      </div>
      <button onClick={startGame}>Start game</button>
    </Styled.Fullscreen>
  ) : (
    <>
      <div>{title}</div>
      <div>Join code: {joinCode}</div>
      <div>Waiting for host to start game...</div>
      <p>You are: {playerName}</p>
    </>
  );
};

export default Lobby;
