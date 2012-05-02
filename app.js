var jojo = require('./src/jojo'),
    app = jojo();

app.listen(8080);

console.log('Server is listening to http://127.0.0.1:8080');