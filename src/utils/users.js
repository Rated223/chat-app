let users = [];

const addUser = ({ id, username, room }) => {
  const userAlreadyExist = users.find((user) => user.username === username && user.room === room);

  if (userAlreadyExist) {
    return { error: 'Este nombre de usuario ya esta siendo usado en esta sala' };
  }

  const newUser = { id, username, room };
  users.push(newUser);
  return { user: newUser };
}

const removeUser = ({ id }) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return { error: "Este usuario no existe" }
  }

  return users.splice(index, 1)[0];
}

const getUser = ({ id }) => {
  const user = users.find((user) => user.id === id);

  if (!user) {
    return { error: "Este usuario no existe" }
  }

  return {user};
}

const getUsersInRoom = ({ room }) => {
  return users.filter((user) => user.room === room);
}

export {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}