let modal = document.getElementById("modal-register");

window.addEventListener('load', () => {
  modal.style.display = "block";
});

document.querySelector("#submit-username").addEventListener("click", () => sendUser())

const sendUser = () => {
  let username = document.querySelector("#input-username").value;

  if (username === "") {
    return alert('Seleccione un nombre se usuario');
  }

  const usercolor = getRandomColor();

  localStorage.setItem('username', username);
  localStorage.setItem('usercolor', usercolor);
  socket.emit('userRegistered', username, (confirmation) => {
    console.log(confirmation);
    modal.style.display = "none";
  });
}

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}