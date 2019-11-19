const socket = io();
let modal = document.getElementById("modal-register");

window.addEventListener('load', () => {
  modal.style.display = "block";
});

document.querySelector("#submit-username").addEventListener("click", () => sendUser())

const sendUser = () => {
  localStorage.clear();
  let username = document.querySelector("#input-username").value.trim().toLowerCase();
  let usercolor = document.querySelector("#input-usercolor").value;
  let room = document.querySelector("#input-roomname").value.trim().toLowerCase();
  // let roomchoise = document.querySelector("input[name='room-choise']:checked").value;

  if (!username) {
    return alert('Seleccione un nombre se usuario');
  }

  if (!usercolor) {
    usercolor = getRandomColor();
  }

  if (!room) {
      return alert('Debe ingresar el nombre de alguna sala de chat.');
  }

  //TODO: cuando se almacene la informacion en base de datos, añadir validacion para buscar un nombre de sala existente
  localStorage.setItem('room', room);
  localStorage.setItem('username', username);
  localStorage.setItem('usercolor', usercolor);

  socket.emit('join', { username, room }, (error) => {
    if (error) {
      return alert(error);
    }
    modal.style.display = "none";
  });
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}