import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import useGameState from '../../hooks/useGameState';

const JoinLobby = () => {
  const history = useHistory();

  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const { setUserRole, setSession, setCurrentGame, setGameState } = useGameState();

  const joinLobby = async () => {
    const url = process.env.REACT_APP_API_URL + '/api/lobby/join';
    const response = await axios.post(
      url,
      { join_code: joinCode, name: nickname },
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.status === 200) {
      console.log("got to join ", response.data);
      setUserRole('client');
      setSession(response.data.session_id);
      setCurrentGame(response.data.game);
      setGameState('Lobby');
      console.log('/game/' + joinCode);
      history.push('/game/' + joinCode);
    }
  };

  return (
    <>
      <div style={{ paddingTop: '3rem' }}>Join code:</div>
      <div style={{ margin: '2rem' }}>
        <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
      </div>
      <div style={{ paddingTop: '3rem' }}>Nickname:</div>
      <div style={{ margin: '2rem' }}>
        <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} />
      </div>

      <div style={{ margin: '2rem' }}>
        <button onClick={joinLobby}>Join game</button>
      </div>

      <div style={{ margin: '2rem' }}>
        <button onClick={() => history.push('/')}>Back</button>
      </div>
    </>
  );
};

export default JoinLobby;
