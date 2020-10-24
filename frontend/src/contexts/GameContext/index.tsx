import React, { useState, useCallback } from 'react';
import GameContext from './context';
import Sockette from 'sockette';
import GameState from '../../Pages/Games/statetype';
const GameContextProvider: React.FC = props => {
  const [role, setRole] = useState<'client' | 'server'>('server');
  const [socket, setSocket] = useState<Sockette | null>(null);
  const [session, setSessionId] = useState<String>(''); 
  const [gameState, setState] = useState<GameState>(undefined);
  const [currentGame, setGame] = useState<'SecretMussolini'>('SecretMussolini');
  const setUserRole = useCallback((newRole: string) => {
    setRole(newRole as 'client' | 'server');
  }, []);

  const setLobbySocket = useCallback((newSocket: Sockette) => {
    setSocket(newSocket as Sockette);
  }, []);

  const setSession = useCallback((newSession: String) => {
    setSessionId(newSession as String);
  }, []);

  const setGameState = useCallback((newGameState: GameState) => {
    setState(newGameState as GameState);
  }, []);

  const setCurrentGame = useCallback((newGame: string) => {
    setGame(newGame as 'SecretMussolini');
  }, []);
  
  const providerValue = {
    role,
    setUserRole,
    socket,
    setLobbySocket,
    session,
    setSession,
    gameState,
    setGameState,
    currentGame,
    setCurrentGame
  };

  return <GameContext.Provider {...props} value={providerValue} />;
};

export { GameContext };
export default GameContextProvider;
