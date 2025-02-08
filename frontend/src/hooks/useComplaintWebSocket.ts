import React, { useCallback, useEffect } from 'react'
import useWebSocket from 'react-use-websocket';

const WS_URL ='ws://localhost:3001'

export const useComplaintWebSocket = (onComplaintUpdate) => {
    const { sendMessage, lastMessage } = useWebSocket(WS_URL, {
        shouldReconnect: () => true,
        reconnectInterval: 3000,
    });

    const subscribe = useCallback(() => {
        sendMessage(JSON.stringify({ 
            method: 'SUBSCRIBE',
            params: ['creation', 'escalation', 'resolution', 'update'],
        }));
    }, [sendMessage]);

    useEffect(() =>{
        subscribe();
        return() => {
            sendMessage(JSON.stringify({
                method: 'UNSUBSCRIBE',
                params: ['creation', 'escalation', 'resolution', 'update'],
            }));
        };
    }, [subscribe, sendMessage]);

    useEffect(() => {
        if (lastMessage) {
            try {
                const data = JSON.parse(lastMessage.data);
                onComplaintUpdate(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        }
    }, [lastMessage, onComplaintUpdate]);
}