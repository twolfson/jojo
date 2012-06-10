var jojo = require('jojo'),
    app = jojo.createServer();

app.use(jojo);

app.listen(8080);

app.set('view engine', 'ejs');

console.log('Server is listening to http://127.0.0.1:8080');