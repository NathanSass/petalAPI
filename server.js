/* Global Model Object */
APP = {
	models: {
		user: require('./models/user'),
		event: require('./models/event')
	}
}; 

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var router     = express.Router();

var index        = require('./routes/index');
var events       = require('./routes/events');
var users        = require('./routes/users');


/* Connect to database */
mongoose.connect('mongodb://localhost/petalapi');

/*  configure app to use bodyParser()
    this will let us get the data from a POST */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* middleware to use for all requests */
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); // make sure we go to the next routes
});

/* ROUTES FOR API */
/* ============================================================================= */
var prefix = '/api';

app.use(prefix, index);

app.use(prefix + '/events', events);

app.use(prefix + '/users', users);

/* START THE SERVER */
/* ============================================================================= */
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Magic happens on port ' + port);