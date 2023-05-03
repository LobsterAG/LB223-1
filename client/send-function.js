const socket = new WebSocket(generateBackendUrl());
socket.addEventListener('open', () => {
  console.log('WebSocket connected!');
  socket.send(JSON.stringify({ type: 'newUser', user: myUser }));
});
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    //Seleckt one of Code Blocks
    switch (message.type) {
        case 'message':
            const messageElement = generateMessage(message, myUser);
            //Add to messages node messageElement
            document.getElementById('messages').appendChild(messageElement);
            //Make css to see the mensage
            setTimeout(() => {
                messageElement.classList.add('opacity-100');
            }, 100); //ms
            break;
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            console.log("ok");
            const message = document.getElementById('messageInput').value;
            socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
            document.getElementById('messageInput').value = '';
        }
    });
});