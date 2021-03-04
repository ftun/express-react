import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://localhost:9000');
const contentDefaultMessage = "Start writing your document here";

const Index = () => {

    // De forma similar a componentDidMount y componentDidUpdate
    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
          };
          client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            const stateToChange = {};
            if (dataFromServer.type === "userevent") {
              stateToChange.currentUsers = Object.values(dataFromServer.data.users);
            } else if (dataFromServer.type === "contentchange") {
              stateToChange.text = dataFromServer.data.editorContent || contentDefaultMessage;
            }
            stateToChange.userActivity = dataFromServer.data.userActivity;
          };
        
    });

    return <div>Cliente</div>;
};

export default Index;