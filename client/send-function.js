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
            setTimeout(() => {
                const currentMessage = getCurrentMessage();
                //If User are typing make nothing so that the write indication is not delet
                if (currentMessage && currentMessage.type === 'typing') { //&& exist
                    return;
                }
                removeTyping();
            }, 100);
            break;
        case 'typing':
            let typingElement = document.getElementById('typing');
            //If typing dont exist
            if (!typingElement) {
                //Add typing to de element
                typingElement = generateTyping(message, myUser);
                document.getElementById('messages').appendChild(typingElement);
                setTimeout(() => {
                    typingElement.classList.add('opacity-100');
                }, 100);
            }
            break;
    }

    document.addEventListener('keydown', (event) => {
        console.log("ok");
        // Only send if the typed in key is not a modifier key
        if (event.key.length === 1) {
            socket.send(JSON.stringify({ type: 'typing', user: myUser }));
        }
        // Only send if the typed in key is the enter key
        if (event.key === 'Enter') {
            const message = document.getElementById('messageInput').value;
            socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
            document.getElementById('messageInput').value = '';
        }
    });
});

