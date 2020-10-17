
import React, { useEffect } from 'react';
import axios from 'axios'

import useRoleState from "../../hooks/useRoleState";

const Lobby = () => {
  const joinCode = window.location.pathname.split("/")[2];

  const {role} = useRoleState()


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
        {role === "host" ? <button onClick={startGame}>Start game</button> : <div>Waiting for host to start game...</div> }
        

    </>
  );
}

export default Lobby;
