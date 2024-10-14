import { app, input } from '@azure/functions';

const inputSignalR = input.generic({
    type: 'signalRConnectionInfo',
    name: 'connectionInfo',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalr269bd726eb.service.signalr.net;AccessKey=8Peg89WLdIuUDxsg3utnj039xlk3kR886PzPZ6cPbihpX7VRid54JQQJ99AJACHYHv6XJ3w3AAAAASRSYnnm;Version=1.0;',
});

app.http('open-signalr-connection', {
    authLevel: 'anonymous',
    handler: (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get(inputSignalR)) }
    },
    route: 'negotiate',
    extraInputs: [inputSignalR]
});