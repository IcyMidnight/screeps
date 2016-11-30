var withDefault = require('util.withDefault');

var mem;

module.exports = {
    newLoop: function() {
        mem = {}
	},
	
	get: function(name) {
	    return withDefault.getObj(mem, name);
	},
};
