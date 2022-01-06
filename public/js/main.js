const chatForm  = document.getElementById('chat-form');


const socket = io();

socket.on('message', message => {
console.log(message); 
});

//Message Submit 
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();


    //Get Message Text
    const msg  = e.target.elements.msg.value;
    
    //Emit Message to Serve
    socket.emit('chatMessage',msg);

});