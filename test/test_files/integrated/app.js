// Require jojo and create a server
var jojo = require('../../../src/jojo'),
    express = jojo.express,
// jojo.createServer makes an express server and auto-uses jojo
    app = jojo.createServer();

app.listen(11550);

app.set('view engine', 'ejs');
app.use(express['static'](process.cwd() + '/public'));

console.log('Server is listening to http://127.0.0.1:11550');