import { Socket } from 'dgram';
import { createContext } from 'react';
import Sockette from 'sockette';
type GameContext = {
  role: ("client" | "server");
  setUserRole: (newRole: string) => void;
  socket: (Sockette | null);
  setLobbySocket: (newSocket: Sockette) => void;
  session: (String);
  setSession: (newSession: String) => void;
};

export default createContext<GameContext | undefined>(undefined);