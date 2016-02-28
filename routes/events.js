var express = require('express');
var router  = express.Router();
var Event   =  APP.event;
var User    =  APP.user;

router.route('/')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        User.findById(req.body.user_id, function(err, user) {
            if (err) { res.send(err); }
            var event = new Event();
            event.title     = req.body.title;
            event.street    = req.body.street;
            
            event.createdBy = req.body.user_id;
            
            event.save(function(err) {
                if (err) { res.send(err); }

                user.eventsAttending.push(event.id);
                user.eventsCreated.push(event.id);
                user.markModified('eventsAttending');
                user.markModified('eventsCreated');
                user.save();

                res.json({ message: 'Event created!' });
            });
            // Add event to attending & created
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
router.route('/:event_id')

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

        Event.findById(req.params.event_id, function(err, event) {

            if (err)
                res.send(err);

            if ("title" in req.body)
                event.title  = req.body.title;
            if ("street" in req.body)
                event.street = req.body.street;
            if ("data" in req.body)
                event.date   = req.body.date;

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

module.exports = router;