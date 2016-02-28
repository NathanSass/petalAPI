var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EventSchema   = new Schema({
    title: String,
    street: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', EventSchema);