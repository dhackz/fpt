import React from 'react';
import './App.css';
import HostOrJoin from './Pages/HostOrJoin';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import SelectGamemode from './Pages/SelectGamemode';
import Game from './Pages/Game';
import JoinLobby from './Pages/JoinLobby';
import GameContextProvider from './contexts/GameContext';

const App = () => {
  return (
    <div data-testid="app-wrapper" className="App">
      <GameContextProvider>
        <BrowserRouter>
          <Route exact path="/" component={HostOrJoin} />
          <Route exact path="/create-lobby" component={SelectGamemode} />
          <Route exact path="/join-lobby" component={JoinLobby} />
          <Route path="/game/:joinCode" component={Game} />
        </BrowserRouter>
      </GameContextProvider>
    </div>
  );
};

export default App;
