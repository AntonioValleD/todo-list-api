const app =  require('./app').app;
const port = 3000;

// Server
app.listen(port, () => {
    console.log('Server started at port 3000');
});