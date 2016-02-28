// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Event      = require('./models/event');

//Connect to database
mongoose.connect( 'mongodb://localhost/petalapi');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.route('/events')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var event  = new Event();      // create a new instance of the Bear model
        event.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        event.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Event created!' });
        });
    })
    .get(function(req, res) {
        Event.find(function(err, events) {
            if (err)
                res.send(err);

            res.json(events);
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/events/:event_id')

    // get the event with that id (accessed at GET http://localhost:8080/api/events/:event_id)
    .get(function(req, res) {
        Event.findById(req.params.event_id, function(err, event) {
            if (err)
                res.send(err);
            res.json(event);
        });
    })
    // update the event with this id (accessed at PUT http://localhost:8080/api/events/:event_id)
    .put(function(req, res) {

        // use our event model to find the event we want
        Event.findById(req.params.event_id, function(err, event) {

            if (err)
                res.send(err);

            event.name = req.body.name;  // update the bears info

            // save the bear
            event.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Event updated!' });
            });

        });
    })
    // delete the event with this id (accessed at DELETE http://localhost:8080/api/event/:event_id)
    .delete(function(req, res) {
        Event.remove({
            _id: req.params.event_id
        }, function(err, event) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);