var express = require('express');
var router  = express.Router();
var async   = require('async');
var util    = require('../js/util.js');
var Event   = APP.models.event;
var User    = APP.models.user;

router.route('/')

    /* create a event (accessed at POST http://localhost:8080/api/events)
    *  Also creates the "join" between the user that created it, and adds the user to attending it
    */
    .post(function(req, res) {
        User.findById(req.body.user_id, function(err, user) {
            if (err) { res.send(err); }

            //noinspection JSClosureCompilerSyntax
            var event = new Event();

            event.title  = req.body.title;

            event.street = req.body.street;
            event.city   = req.body.city;
            event.state  = req.body.state;

            event.startDateTime = req.body.startDateTime;
            event.endDateTime   = req.body.endDateTime;

            event.about     = req.body.about;
            event.price     = req.body.price;
            event.eventSize = req.body.eventSize;

            event.loc.lat = req.body.lat;
            event.loc.lng = req.body.lng;

            event.createdBy = req.body.user_id;

            event.save(function(err) {
                if (err) { res.send(err); }

                user.eventsAttending.push(event.id);
                user.markModified('eventsAttending');
                user.save();

                res.json({ success: event });
            });
        });      

    })
    .get(function(req, res) {
        Event.find(function(err, events) {
            if (err) { res.send(err); }

            res.json(events);
        });
    });

/* on routes that end in /events/:event_id */
/* ---------------------------------------------------- */
router.route('/:event_id')

    /* get the event with that id (accessed at GET http://localhost:8080/api/events/:event_id) */
    .get(function(req, res) {
        Event.findById(req.params.event_id, function(err, event) {
            if (err) { res.send(err); }

            res.json(event);
        });
    })
    /* update the event with this id (accessed at PUT http://localhost:8080/api/events/:event_id) */
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
    /* delete the event with this id (accessed at DELETE http://localhost:8080/api/event/:event_id) */
    .delete(function(req, res) {
        Event.remove({
            _id: req.params.event_id
        }, function(err, event) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

/* on routes that end in /events/users/:user_id */
/* Returns and event objects based on user query
/* ---------------------------------------------------- */
router.route('/users/:user_id')

    /* returns the likedEvents (accessed at GET http://localhost:8080/api/user/events/:user_id) */
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) { res.send(err); }

            async.parallel({
                attending: function(callback) {
                    Event.find({'_id': {$in: user.eventsAttending}}, callback);
                },
                createdBy: function(callback) {
                    Event.find({'createdBy': user.id}, callback);
                },
                allEvents: function(callback) {
                    Event.find(callback);
                }
            }, function(err, results){
                if (err) { res.send(err); }

                var allEventsIds   = util.getArrOfIds(results.allEvents);
                var eventsToRemove = util.getArrOfIds(results.attending);

                var eventIdsToDisplay = allEventsIds.filter( function(el) {
                    return eventsToRemove.indexOf(el) < 0;
                });

                console.log("results", results);
                Event.find({ //TODO: Add query here for location & limit records
                    '_id': { $in: eventIdsToDisplay }
                }, function(err, events) {
                    if (err) { res.send(err); }

                    res.json({ userAttending: results.attending, userCreated: results.createdBy, newEvents: events });
                });

            });

        });
    });

module.exports = router;