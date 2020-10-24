import { createContext } from 'react';
import Sockette from 'sockette';
import GameState from '../../Pages/Games/statetype';
type GameContext = {
  role: 'client' | 'server';
  setUserRole: (newRole: string) => void;
  socket: Sockette | null;
  setLobbySocket: (newSocket: Sockette) => void;
  session: String;
  setSession: (newSession: String) => void;
  gameState: GameState;
  setGameState: (newGameState: GameState) => void;
  currentGame: 'SecretMussolini';
  setCurrentGame: (newGame: string) => void;
};

export default createContext<GameContext | undefined>(undefined);
