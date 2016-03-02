var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var User = require('./user');

var EventSchema   = new Schema({
    title: String,

    street: String,
    city: String,
    state: String,

    startDateTime: Date,
    endDateTime: Date,

    about: String,
    price: Number,
    eventSize: Number,

    loc: {
        lng: Number,
        lat: Number,
        index: { type: String }
    },

    createdBy: { type : Schema.Types.ObjectId, ref: 'User' }
});

EventSchema.index({ "loc": "2d" });

module.exports = mongoose.model('Event', EventSchema);