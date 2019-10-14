const socket = io();

socket.on('message', ({text, createAt}) => {
    console.log(text);
    const html = Mustache.render(document.querySelector('#message-template').innerHTML, {
        text,
        date: moment(createAt).format('h:mm a')
    });
    document.querySelector("#messages-container").insertAdjacentHTML('afterbegin', html);
    document.querySelector("#flex-wrapper").scrollTop = document.querySelector("#flex-wrapper").scrollHeight;
});

socket.on('locationMessage', ({text, createAt}) => {
    console.log(text);
    const html = Mustache.render(document.querySelector('#link-template').innerHTML, {
        link: text,
        message: "User Location",
        date: moment(createAt).format('h:mm a')
    });
    document.querySelector("#messages-container").insertAdjacentHTML('afterbegin', html);
    document.querySelector("#flex-wrapper").scrollTop = document.querySelector("#flex-wrapper").scrollHeight;
});

document.querySelector('#send-message-button').addEventListener('click', () => sendMessage());

document.querySelector("#message-box").addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        sendMessage();
    }
});

document.querySelector("#send-location-button").addEventListener('click', () => sendLocation());

const sendMessage = () => {
    const message = document.querySelector('#message-box').value;
    if (message !== "") {
        document.querySelector('#send-message-button').setAttribute('disabled', 'disabled');
        document.querySelector('#send-message-button > .loader').style.display = 'inline-block';
        socket.emit("sendMessage", "User send: "+message, (confirmation) => {
            console.log(confirmation);
            document.querySelector('#send-message-button').removeAttribute('disabled');
            document.querySelector('#send-message-button > .loader').style.display = 'none';
            document.querySelector('#message-box').value = '';
            document.querySelector('#message-box').focus();
        });
    }
}

const sendLocation = () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser.');
    }
    document.querySelector("#send-location-button").setAttribute('disabled', 'disabled');
    document.querySelector('#send-location-button > .loader').style.display = 'inline-block';
    navigator.geolocation.getCurrentPosition(({coords}) => {
        const cordinates = { 
            latitude: coords.latitude, 
            longitude: coords.longitude
        };
        socket.emit('sendLocation', cordinates, (confirmation) => {
            console.log(confirmation);
        });
        document.querySelector("#send-location-button").removeAttribute('disabled');
        document.querySelector('#send-location-button > .loader').style.display = 'none';
    });
}

  
  