
import React from 'react';

const SelectGamemode = () => {
  return (
    <>
      <div style={{padding: "3rem"}}>Chose gamemode</div>
      
      Det blir secret hitler liksom
      
      <div style={{margin: "2rem"}}><button onClick={() => console.log("request to create lobby, use id in response to go to new url with that id")}>Create lobby</button></div>
    </>
  );
}

export default SelectGamemode;
