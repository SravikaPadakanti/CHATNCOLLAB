import socket from 'socket.io-client';


let socketInstance = null;


export const initializeSocket = (projectId) => {
    const socketUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

    socketInstance = socket(socketUrl, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        }
    });

    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}