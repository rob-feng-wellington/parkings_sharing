var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    config          = require('./config');

var app = express();
app.set('SuperSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

app.use(logger('dev'));
app.use(errorhandler());

//not protected
app.use(require('./user-routes'));
app.use(require('./setup'));
app.use(require('./parking-routes'))

//protected
app.use(require('./booking-routes'));

var port = 3001;

mongoose.connect(config.database);

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
