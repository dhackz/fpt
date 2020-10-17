
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios'

const Lobby = () => {
  const history = useHistory();
  const joinCode = window.location.pathname.split("/")[2];

  const [players, setPlayers] = useState([]);

  return (
    <>
        <div>Welcome to the lobby</div>
        <div>To join, enter code: {joinCode}</div>

    </>
  );
}

export default Lobby;
