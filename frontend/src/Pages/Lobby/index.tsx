
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios'

import useRoleState from "../../hooks/useRoleState";

const Lobby = () => {
  const history = useHistory();
  const joinCode = window.location.pathname.split("/")[2];

  const [players, setPlayers] = useState([]);
  const {role} = useRoleState()


  const startGame = () => {
      console.log("starting game.. aka doing nothing atm...")
  }

  useEffect(()=>{console.log("role", role)},[role])

  return (
    <>
        <div>Welcome to the lobby</div>
        <div>To join, enter code: {joinCode}</div>
        {role === "host" ? <button onClick={startGame}>Start game</button> : <div>Waiting for host to start game...</div> }
        

    </>
  );
}

export default Lobby;
