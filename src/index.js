const app =  require('./app').app;

const port = process.env.PORT || 3000;

// Server
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});