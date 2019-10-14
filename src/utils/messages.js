const generateMessage = (message) => {
  return {
    text: message,
    createAt: new Date().getTime()
  }
}

export {
  generateMessage
}