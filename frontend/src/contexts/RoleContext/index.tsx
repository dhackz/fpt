import React, { useState, useCallback } from 'react';
import RoleContext from './context';

const RoleContextProvider: React.FC = props => {

  const [role, setRole] = useState<"client"|"host">("host");

  const setUserRole = useCallback((newRole:string)=> {
    setRole(newRole as ("client"|"host"))
  }, []);

  const providerValue = {
    role,
    setUserRole
  };

  return <RoleContext.Provider {...props} value={providerValue} />;
};

export { RoleContext };
export default RoleContextProvider;
