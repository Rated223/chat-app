socket.on('message', ({text, username, usercolor, createAt}) => {
    const html = Mustache.render(document.querySelector('#message-template').innerHTML, {
        text,
        username: username ? `${username}: ` : '',
        usercolor,
        date: moment(createAt).format('h:mm a')
    });
    if ((document.querySelector("#flex-wrapper").offsetHeight + document.querySelector("#flex-wrapper").scrollTop) >= document.querySelector("#flex-wrapper").scrollHeight) {
        document.querySelector("#messages-container").insertAdjacentHTML('afterbegin', html);
        document.querySelector("#flex-wrapper").scrollTop = document.querySelector("#flex-wrapper").scrollHeight;
    } else {
        document.querySelector("#messages-container").insertAdjacentHTML('afterbegin', html);
    }
});

socket.on('locationMessage', ({text, username, usercolor, createAt}) => {
    const html = Mustache.render(document.querySelector('#link-template').innerHTML, {
        link: text,
        username: username ? `${username}: ` : '',
        message: username ? `${username} Location` : '',
        usercolor,
        date: moment(createAt).format('h:mm a')
    });
    if ((document.querySelector("#flex-wrapper").offsetHeight + document.querySelector("#flex-wrapper").scrollTop) >= document.querySelector("#flex-wrapper").scrollHeight) {
        document.querySelector("#messages-container").insertAdjacentHTML('afterbegin', html);
        document.querySelector("#flex-wrapper").scrollTop = document.querySelector("#flex-wrapper").scrollHeight;
    } else {
        document.querySelector("#messages-container").insertAdjacentHTML('afterbegin', html);
    }
});

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(document.querySelector("#sidebar-template").innerHTML, {
        room,
        users
    });
    document.querySelector("#users-container").innerHTML = html;
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
    const username = localStorage.getItem('username');
    const usercolor = localStorage.getItem('usercolor');
    const room = localStorage.getItem('room');

    const message = document.querySelector('#message-box').value;
    if (message !== "") {
        document.querySelector('#send-message-button').setAttribute('disabled', 'disabled');
        document.querySelector('#send-message-button > .loader').style.display = 'inline-block';

        socket.emit("sendMessage", {message, username, usercolor, room}, (error) => {
            if (error) {
                return alert(error);
            }
            document.querySelector('#send-message-button').removeAttribute('disabled');
            document.querySelector('#send-message-button > .loader').style.display = 'none';
            document.querySelector('#message-box').value = '';
            document.querySelector('#message-box').focus();
        });
    }
}

const sendLocation = () => {
    const username = localStorage.getItem('username');
    const usercolor = localStorage.getItem('usercolor');
    const room = localStorage.getItem('room');

    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser.');
    }
    document.querySelector("#send-location-button").setAttribute('disabled', 'disabled');
    document.querySelector('#send-location-button > .loader').style.display = 'inline-block';
    navigator.geolocation.getCurrentPosition(({coords}) => {
        const latitude = coords.latitude; 
        const longitude = coords.longitude;
        socket.emit('sendLocation', {latitude, longitude, username, usercolor, room}, (error) => {
            if (error) {
                return alert(error);
            }
        });
        document.querySelector("#send-location-button").removeAttribute('disabled');
        document.querySelector('#send-location-button > .loader').style.display = 'none';
    });
}