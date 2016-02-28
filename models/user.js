var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    age: { type: Number, max: 100, min: 10 },
    username: String,
    password: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);