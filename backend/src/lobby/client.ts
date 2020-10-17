import * as WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080')

ws.on('open', () => {
    console.log("Connection to websocket server established.")

    let register = {
        action: 'register',
        actor: 'client',
        sessionId: '1',
        userName: 'vild'
    }

    ws.send(JSON.stringify(register))
})

ws.on('message', (data) => {
    console.log('I received:')
    console.log(data)
})
