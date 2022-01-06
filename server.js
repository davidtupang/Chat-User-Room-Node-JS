const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app =express();
const server = http.createServer(app);
const io = socketio(server);    


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'ChatCord Bot';

//Run When Client Connection
io.on('connection',socket =>{

        socket.on('joinRoom',({username,room})=>{
            
        const user = userJoin(socket.id,username,room);

        socket.join(user.room);

        //Welcome Current user 
        socket.emit('message', formatMessage(botName,'Wellcome to ChatCord!'));

        //Broadcast when a user connect
        socket.broadcast.to(user.room).emit('message',  formatMessage(botName,`${user.username} has joined the Chat`));
        
        //Send Users and room Info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    
   
    //Listen For Chat Message
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        //console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

    //Run When Client Disconnect
    socket.on('disconnect',()=>{
    const user = userLeave(socket.id);

    if(user){   
        io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the Chat`));
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    }
    });
}); 
 

const PORT = 3000 || process.env.PORT;

server.listen(PORT,() =>   console.log(`Server Running On Port ${PORT}`));
