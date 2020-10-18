
import React, { useEffect } from 'react';
import axios from 'axios'

import useRoleState from "../../hooks/useRoleState";
import * as Styled from './styles';

const Lobby = () => {
  const joinCode = window.location.pathname.split("/")[2];

  const {role} = useRoleState();

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

  const title = "Secret Mussolini";
  
  return (
    role=== "host" ? 
        <Styled.Fullscreen>
            <div style={{borderRadius: "50%", backgroundColor: "white", width: "40vw", height: "40vw", position: "fixed",
    top: "50%",
    left: "50%",
    WebkitTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)"}}/>
            <div style={{
                color:"white",
                position: "absolute",
                top: "10rem",
                left: "6rem",
                fontSize: "60px",
                transform: "rotate(-20deg)"
            }}>
                {title}
            </div>
            <div style={{
                color:"white",
                position: "absolute",
                top: "10rem",
                right: "6rem",
                fontSize: "48px",
                transform: "rotate(20deg)"
            }}>
                Join code: {joinCode}
            </div>
            <button onClick={startGame}>Start game</button>
        </Styled.Fullscreen> 
    : 
        <>
            <div>{title}</div>
            <div>Join code: {joinCode}</div>
            <div>Waiting for host to start game...</div>
        </>
  );
}

export default Lobby;
