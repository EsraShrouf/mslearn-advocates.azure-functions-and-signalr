import { app, output, CosmosDBv4FunctionOptions, InvocationContext } from "@azure/functions";

const goingOutToSignalR = output.generic({
    type: 'signalR',
    name: 'signalR',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalr269bd726eb.service.signalr.net;AccessKey=8Peg89WLdIuUDxsg3utnj039xlk3kR886PzPZ6cPbihpX7VRid54JQQJ99AJACHYHv6XJ3w3AAAAASRSYnnm;Version=1.0;',
});

export async function dataToMessage(documents: unknown[], context: InvocationContext): Promise<void> {

    try {

        context.log(`Documents: ${JSON.stringify(documents)}`);

        documents.map(stock => {
            // @ts-ignore
            context.log(`Get price ${stock.symbol} ${stock.price}`);
            context.extraOutputs.set(goingOutToSignalR,
                {
                    'target': 'updated',
                    'arguments': [stock]
                });
        });
    } catch (error) {
        context.log(`Error: ${error}`);
    }
}

const options: CosmosDBv4FunctionOptions = {
    connection: 'COSMOSDB_CONNECTION_STRING',
    databaseName: 'stocksdb',
    containerName: 'stocks',
    createLeaseContainerIfNotExists: true,
    feedPollDelay: 500,
    handler: dataToMessage,
    extraOutputs: [goingOutToSignalR],
};

app.cosmosDB('send-signalr-messages', options);