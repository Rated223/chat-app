import { spawn } from "child_process";

const generateMessage = ({message, username, usercolor}) => {
  return {
    text: message,
    username,
    usercolor,
    createAt: new Date().getTime()
  }
}



export {
  generateMessage
}

