import Sockette from 'sockette';
const newSocketListener = (cb: (socket: Sockette, event: MessageEvent) => any) => {
  const ws: Sockette = new Sockette('ws://localhost:8000/api', {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: (e: Event) => () => {
      console.log('Connected!', e);
    },
    onmessage: e => cb(ws, e),
    onreconnect: e => console.log('Reconnecting...', e),
    onmaximum: e => console.log('Stop Attempting!', e),
    onclose: e => console.log('Closed!', e),
    onerror: e => console.log('Error:', e)
  });
};

export { newSocketListener };
