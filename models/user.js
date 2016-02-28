var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Event = require('./event');

var UserSchema   = new Schema({
    name: String,
    age: { type: Number, max: 100, min: 10 },
    username: String,
    password: String,
    date: { type: Date, default: Date.now },
    eventsAttending: [ { type : Schema.Types.ObjectId, ref: 'Event' } ],
    eventsCreated: [ { type : Schema.Types.ObjectId, ref: 'Event' } ]
});

module.exports = mongoose.model('User', UserSchema);