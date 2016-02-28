var express  = require('express');
var router   = express.Router();
// var User     = require('../models/user');
// var Event    = require('../models/Event');

// router.route('/user/:user_id')

//     // get the event with that id (accessed at GET http://localhost:8080/api/events/:event_id)
//     .get(function(req, res) {
//         User.findById(req.params.user_id, function(err, user) {
//             if (err)
//                 res.send(err);
//             res.json(user);
//         });
//     })
//     // update the event with this id (accessed at PUT http://localhost:8080/api/events/:event_id)
//     .put(function(req, res) {

//         User.findById(req.params.user_id, function(err, user) {

//             if (err)
//                 res.send(err);
                
//             if ("attending" in req.body)

//             user.save(function(err) {
//                 if (err)
//                     res.send(err);
//                 res.json({ message: 'User updated!' });
//             });

//         });
//     });

module.exports = router;