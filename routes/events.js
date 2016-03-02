var express = require('express');
var router  = express.Router();
var Event   =  APP.models.event;
var User    =  APP.models.user;

router.route('/')

    /* create a event (accessed at POST http://localhost:8080/api/events)
    *  Also creats the "join" between the user that created it, and adds the user to attending it
    */
    .post(function(req, res) {
        User.findById(req.body.user_id, function(err, user) {
            if (err) { res.send(err); }
            var event       = new Event();

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

                res.json({ success: event });
            });
        });      

    })
    .get(function(req, res) {
        Event.find(function(err, events) {
            if (err)
                res.send(err);

            res.json(events);
        });
    });

/* on routes that end in /events/:event_id */
/* ---------------------------------------------------- */
router.route('/:event_id')

    /* get the event with that id (accessed at GET http://localhost:8080/api/events/:event_id) */
    .get(function(req, res) {
        Event.findById(req.params.event_id, function(err, event) {
            if (err)
                res.send(err);
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

            Array.prototype.getUnique = function(){
                var u = {}, a = [];
                for(var i = 0, l = this.length; i < l; ++i){
                    if(u.hasOwnProperty(this[i])) {
                        continue;
                    }
                    a.push(this[i]);
                    u[this[i]] = 1;
                }
                return a;
            };

            var userAttending = user.eventsAttending; // array

            if (userAttending.length === 0) {
                Event.find(function(err, events) {
                    if (err)
                        res.send(err);

                    res.json({ userAttending: [], userCreated: [], newEvents: events });
                });


            } else {


                Event.find({
                    '_id': { $in: userAttending }
                }, function(err, attending){
                    if (err) { res.send(err); }

                    Event.find({
                        'createdBy': user.id
                    }, function(err, created){
                        if (err) { res.send(err); }

                        Event.find(function(err, events) {
                            if (err) { res.send(err); }

                            var eventIDs = events.map(function(obj){
                                return obj.id;
                            });

                            var userCreatedIds =  created.map(function(obj) {
                                return obj.id;
                            });

                            var eventsToRemove = userAttending.concat(userCreatedIds).getUnique()
                                .map(function(id){
                                    return id + "";
                                });

                            var unseenEventIds = eventIDs.filter( function( el ) {
                                return eventsToRemove.indexOf( el ) < 0;
                            } );


                            Event.find({ //TODO: Add query here for location & limit records
                                '_id': { $in: unseenEventIds }
                            }, function(err, events) {
                                if (err) { res.send(err); }

                                res.json({ userAttending: attending, userCreated: created, newEvents: events });
                            });

                        });

                    });

                });


            }

        });
    });

module.exports = router;