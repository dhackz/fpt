import { useContext } from 'react';
import { RoleContext } from '../contexts/RoleContext';

const useRoleState = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('Role context not defined');
  }
  return context;
};

export default useRoleState;
