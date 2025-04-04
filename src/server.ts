import WebSocket from 'ws';
import * as url from 'node:url';

const wss = new WebSocket.Server({ port: 8080 });
let clientList: Array<{ id: string, battleCode: string, wsSession: WebSocket }> = [];
const battleCodeList: string[] = [];

wss.on('connection', (ws: WebSocket, req) => {
  let id: string | undefined;
  let battleCode: string | undefined;

  if (req.url) {
    let parsedQuery = url.parse(req.url || '', true);
    [id, battleCode] = parsedQuery.query.token && parsedQuery.query.battleCode ? [parsedQuery.query.token, parsedQuery.query.battleCode] as string[] : [undefined, undefined];

    if (id && battleCode) {
      clientList.push({ id: id, battleCode: battleCode, wsSession: ws })
    }

    if (battleCode && !battleCodeList.includes(battleCode)) {
      battleCodeList.push(battleCode);
    }

    console.log(`New client connected: ${id} looking for ${battleCode} session`);
  }

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message} from ${id} on battle Session: ${battleCode}`);
    clientList.filter((client) => client.battleCode === battleCode).forEach((client) => {
      client.wsSession.send(
        `Server received your message: ${message} Mister ${id} !\n`+
        `Sending a response to all users on battle session ${battleCode} !`
      );
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});