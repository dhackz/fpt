import { createContext } from 'react';

type RoleContext = {
  role: ("client" | "host");
  setUserRole: (newRole: string) => void;
};

export default createContext<RoleContext | undefined>(undefined);