import React, { useState, useCallback } from 'react';
import GameContext from './context';
import Sockette from 'sockette';
const GameContextProvider: React.FC = props => {
  const [role, setRole] = useState<'client' | 'server'>('server');
  const [socket, setSocket] = useState<Sockette | null>(null);
  const [session, setSessionId] = useState<String>("");
  const [players, setPlayers] = useState<String[]>([]);
  const [playerName, setPlayer] = useState<String>("");
  const setUserRole = useCallback((newRole:string)=> {
    setRole(newRole as ("client"|"server"))
  }, []);

  const setLobbySocket = useCallback((newSocket: Sockette) => {
    setSocket(newSocket as Sockette);
  }, []);

  const setSession = useCallback((newSession: String) => {
    setSessionId(newSession as String);
  }, []);

  const setPlayersList = useCallback((newPlayers: String[]) => {
    setPlayers(newPlayers as String[])
  }, []);

  const setPlayerName = useCallback((newPlayer: String) => {
    setPlayer(newPlayer as String)
  }, []);

  const providerValue = {
    role,
    setUserRole,
    socket,
    setLobbySocket,
    session,
    setSession,
    players,
    setPlayersList,
    playerName,
    setPlayerName
  };

  return <GameContext.Provider {...props} value={providerValue} />;
};

export { GameContext };
export default GameContextProvider;
