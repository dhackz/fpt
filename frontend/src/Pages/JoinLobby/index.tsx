
import React from 'react';
import { useHistory } from "react-router-dom";

const JoinLobby = () => {
  const history = useHistory();
  return (
    <>
      <div style={{paddingTop: "3rem"}}>Room code:</div>
      <div style={{margin: "2rem"}}><input type="text"/></div>
      <div style={{paddingTop: "3rem"}}>Nickname:</div>
      <div style={{margin: "2rem"}}><input type="text"/></div>
      
      <div style={{margin: "2rem"}}><button onClick={() => console.log("join game")}>Join game</button></div>

      <div style={{margin: "2rem"}}><button onClick={() => history.push("/")}>Back</button></div>
    </>
  );
}

export default JoinLobby;
