// Require jojo and create a server
var jojo = require('../../../src/jojo'),
    app = jojo({
      "title": "jojo demo",
      "url": "http://localhost:8080/",
      "defaults": {
        "author": "Todd Wolfson"
      }
    });

app.listen(11550);

app.set('view engine', 'ejs');

console.log('Server is listening to http://127.0.0.1:11550');