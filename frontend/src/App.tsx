import React from 'react';
import './App.css';
import HostOrJoin from './Pages/HostOrJoin';
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SelectGamemode from './Pages/SelectGamemode';
import JoinLobby from './Pages/JoinLobby';
import Lobby from './Pages/Lobby';
import RoleContextProvider from './contexts/RoleContext';

const App = () => {
  return (
    <div data-testid="app-wrapper" className="App">
      <RoleContextProvider>
        <BrowserRouter>
          <Route exact path="/" component={HostOrJoin}/>
          <Route exact path="/create-lobby" component={SelectGamemode}/>
          <Route exact path="/join-lobby" component={JoinLobby}/>
          <Route path="/lobby" component={Lobby}/>
        </BrowserRouter>
      </RoleContextProvider>
    </div>
  );
}

export default App;
