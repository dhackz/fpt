
import React from 'react';
import { useHistory } from "react-router-dom";

const HostOrJoin = () => {
  const history = useHistory();
  return (
    <>
      <div style={{padding: "3rem"}}>Welcome boiii</div>
      <div style={{margin: "2rem"}}><button onClick={() => history.push("/create-lobby")}>Host game</button></div>
      <div style={{margin: "2rem"}}><button onClick={() => console.log("join game boioii")}>Join game</button></div>
    </>
  );
}

export default HostOrJoin;
