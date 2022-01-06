const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app =express();
const server = http.createServer(app);
const io = socketio(server);    

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Run When Client Connection
io.on('connection',socket =>{
   
    //Run current user 
    socket.emit('message', 'Wellcome to ChatCord!');
    
    //Broadcast when a user connect
    socket.broadcast.emit('message', 'A User has joined the Chat');

    //Run When Client Disconnect
    socket.on('disconnect',()=>{
    io.emit('message','A User has left the Chat');
    });
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT,() =>   console.log(`Server Running On Port ${PORT}`));
