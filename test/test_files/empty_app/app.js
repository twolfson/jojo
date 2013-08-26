// Require jojo and create a server
var jojo = require('../../../src/jojo'),
    app = jojo();

app.listen(11550);

app.set('view engine', 'ejs');

console.log('Server is listening to http://127.0.0.1:11550');