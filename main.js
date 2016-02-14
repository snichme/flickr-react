var express = require('express');
var flickr = require('./flickr');

var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(app.router);
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.render('index');
});
app.get('/flickr', function(req, res) {
    var query = req.query.q;
    if(!query) {
        res.send(404, 'Sorry, we cannot find that!');
    }
    flickr.search("boats").then(function(data) {
        res.json(data);
    });
});

var port = (process.env.PORT || 3000);
console.log("App running on port http://localhost:" + port);
app.listen(port);
