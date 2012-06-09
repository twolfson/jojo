var jojo = require('jojo'),
    app = jojo.createServer();
    
app.use(jojo);

app.listen(8080);

app.get('/abba', function (req, res) {
  res.send('Not a blog post');
});

console.log('Server is listening to http://127.0.0.1:8080');