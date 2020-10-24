import React from 'react';
import HostLobby from './Host/Lobby';
import GuestLobby from './Guest/Lobby';
import useGameState from '../../../hooks/useGameState';
import HostInstructions from './Host/Instructions'
import GuestInstructions from './Guest/Instructions'
const Mussolini = () => {
    const { role, gameState } = useGameState();
    switch (gameState) {
        case "Lobby":
            return role === "server" ? <HostLobby/> : <GuestLobby/>
        case "Instructions":
            return role === "server" ? <HostInstructions /> : <GuestInstructions/>
        default:
            return <>invalid state i guess or NYI</>
    }
}

export default Mussolini;