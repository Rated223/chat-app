const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#send-message-button').addEventListener('click', () => {
    const message = document.querySelector('#message-box').value;
    document.querySelector('#send-message-button').setAttribute('disabled', 'disabled');
    document.querySelector('#send-message-button > .loader').style.display = 'inline-block';
    socket.emit("sendMessage", "User send: "+message, (confirmation) => {
        console.log(confirmation);
        document.querySelector('#send-message-button').removeAttribute('disabled');
        document.querySelector('#send-message-button > .loader').style.display = 'none';
        document.querySelector('#message-box').value = '';
        document.querySelector('#message-box').focus();
    });
});

document.querySelector("#send-location-button").addEventListener('click', () => {
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
})