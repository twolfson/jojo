var jojo = require('jojo'),
    app = jojo.createServer();
    
app.use(jojo);

app.listen(8080);

app.set('view engine', 'ejs');
app.set('jojo index view', 'pages/index');
app.set('jojo article view', 'pages/article');

app.get('/abba', function (req, res) {
  res.send([
    'Hey',
    '<script src="https://raw.github.com/twolfson/File-Watcher/master/src/watcher.js"></script>        ',
    '<script src="https://raw.github.com/twolfson/Resource-Collector/master/src/collector.js"></script>',
    '<script>                                                                                          ',
    '    (function () {                                                                                ',
    '       var watcher = new FileWatcher(),                                                           ',
    '           resources = ResourceCollector.collect();                                               ',
    '       watcher.addListener(function () {                                                          ',
    '         location.reload();                                                                       ',
    '       });                                                                                        ',
    '       watcher.watch(resources);                                                                  ',
    '    }());                                                                                         ',
    '</script>                                                                                         ',
  ].join('\n'));
});

console.log('Server is listening to http://127.0.0.1:8080');