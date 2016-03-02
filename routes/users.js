var express = require('express');
var router  = express.Router();
var User    = APP.models.user;


router.route('/')

    // create user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        var user = new User();
            
            if ("name" in req.body)
                user.name      = req.body.name;
            if ("age" in req.body)
                user.age       = req.body.age;
            if ("username" in req.body)
                user.username  = req.body.username;
            if ("password" in req.body)
                user.password  = req.body.password;
            if ("date" in req.body)
                user.date      = req.body.date;

        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
    })
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    })
    .put(function(req, res) {
        User.findOne(
            { username: req.body.username, password: req.body.password }, function(err, user) {
                if (err) { res.send(err) }
                res.json(user)
        });
    });

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/:user_id')

    // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {

        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);
            
            if ("name" in req.body)
                user.name      = req.body.name;
            if ("age" in req.body)
                user.age       = req.body.age;
            if ("username" in req.body)
                user.username  = req.body.username;
            if ("password" in req.body)
                user.password  = req.body.password;
            if ("date" in req.body)
                user.date      = req.body.date;

            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });

        });
    })
    // delete the event with this id (accessed at DELETE http://localhost:8080/api/event/:event_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });
// on routes that end in users/users/:user_id
// ----------------------------------------------------
router.route('/events/:user_id')

    /* update the event with this id (accessed at PUT http://localhost:8080/api/users/events/:event_id) */
    /* user_id, event_id, isAttending */

    .put(function(req, res) {
        console.log("user_id: ", req.params.user_id, " event_id: ", req.body.event_id, " isAttending: ",req.body.isAttending);
        User.findById(req.params.user_id, function(err, user) {
            if (err) {res.send(err)}

            var isAttending = parseInt(req.body.isAttending, 10);

            var eventId    = req.body.event_id;
            var eventIndex = user.eventsAttending.indexOf(eventId);

            if (isAttending && eventIndex === -1) {
                user.eventsAttending.push(eventId);
                console.log("added: " + eventId);
            }

            if (!isAttending && eventIndex >= 0) {
                user.eventsAttending.splice(eventIndex, 1);
                console.log("removed: " +  eventId)
            }

            user.save(function(err) {
                if (err) {res.send(err)};
                res.json({ message: 'User updated!' });
            });

        });
    });

module.exports = router;