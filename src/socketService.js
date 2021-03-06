import openSocket from 'socket.io-client';
import { store } from './stateManagement/store';
import React, { useEffect, useContext } from 'react';
import { activeChatAction } from './stateManagement/actions';

const SOCKET_URL = 'https://api.tuk2me.com:2053';
let socket;

const SocketService = () => {
    const { state:{ userDetail }, dispatch } = useContext(store);
    const setupSocket = () => {
        socket = openSocket(SOCKET_URL);
        console.log(socket);
        socket.on("command", (data) => {
            console.log(data);
            console.log(userDetail);
            if(!userDetail) return;
            if(userDetail.id !== data.receiver) return;
            dispatch({
                type: activeChatAction,
                payload: true
            });
        });
    };
    useEffect(setupSocket, [userDetail]);
    return <></>;
};

export default SocketService;

const sendSocket = (data) => {
    socket.emit('command', {
        type: data.type,
        id: data.id,
        content: data.content,
    });
};

export const sendTestSocket = (data) => {
    socket.emit("command", data);
};

// if(userDetail !== data.receiver) return;
// dispatch({
//     type: activeChatAction,
//     payload: data
// });

