var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var User = require('./user');

var EventSchema   = new Schema({
    title: String,
    street: String,
    date: { type: Date, default: Date.now },
    createdBy: { type : Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Event', EventSchema);