(function() {

    var exports = module.exports;

    exports.getArrOfIds = function(arr) {
        return arr.map(function(obj) {
           return obj.id;
        });
    };

}());