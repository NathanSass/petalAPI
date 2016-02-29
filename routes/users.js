var express = require('express');
var router  = express.Router();
var User    = APP.models.user;


router.route('/')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
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
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/:user_id')

    // get the event with that id (accessed at GET http://localhost:8080/api/events/:event_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    // update the event with this id (accessed at PUT http://localhost:8080/api/events/:event_id)
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

module.exports = router;