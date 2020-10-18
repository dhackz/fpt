import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import useGameState from '../../hooks/useGameState';

const SelectGamemode = () => {
  const history = useHistory();

  const { setUserRole, setSession } = useGameState();

  const createLobby = async () => {
    const url = process.env.REACT_APP_API_URL + '/api/lobby/new';
    const response = await axios.post(
      url,
      { game: 'secret' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.status === 200) {
      setUserRole('server');
      setSession(response.data.session_id);
      history.push('/lobby/' + response.data.join_code);
    }
  };

  return (
    <>
      <div style={{ padding: '3rem' }}>Chose gamemode</div>
      Det blir secret hitler liksom
      <div style={{ margin: '2rem' }}>
        <button onClick={createLobby}>Create lobby</button>
      </div>
      <div style={{ margin: '2rem' }}>
        <button onClick={() => history.push('/')}>Back</button>
      </div>
    </>
  );
};

export default SelectGamemode;
