import React from 'react';
import useGameState from '../../hooks/useGameState';
import Mussolini from '../Games/SecretMussolini';
const Game = () => {
    const joinCode = window.location.pathname.split('/')[1];
    const {currentGame} = useGameState();
    switch (currentGame) {
        case "SecretMussolini":
            return <Mussolini />
        default:
            return <>lal game</>
    }
}

export default Game;