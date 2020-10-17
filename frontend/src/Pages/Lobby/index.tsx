
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios'

const Lobby = () => {
  const history = useHistory();
  const joinCode = window.location.pathname.split("/")[2];

  const [players, setPlayers] = useState([]);

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
        <button onClick={startGame}>Start</button>
    </>
  );
}

export default Lobby;
