var express = require('express');
var app = express();

app.post('/lobby/new', function (req, res) {
    console.log('yooo');
    var response = {
        'lobby_id': '1d1d',
        'socket_info': 'socket:of:doom',
    };
    res.end(JSON.stringify(response));
});

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
