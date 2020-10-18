import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

const useGameState = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('Role context not defined');
  }
  return context;
};

export default useGameState;
