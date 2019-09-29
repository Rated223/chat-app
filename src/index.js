import app from './app';

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server up and running in port '+port);
})