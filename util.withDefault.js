module.exports = {
	get: function(obj, name, dflt) {
        var value = obj[name];
        if (!value) {
            value = dflt;
            obj[name] = value;
        }
        return value;
	},
	
    getObj: function(obj, name) {
        var value = obj[name];
        if (!value) {
            value = {};
            obj[name] = value;
        }
        return value;
	},
	
	getArr: function(obj, name) {
        var value = obj[name];
        if (!value) {
            value = [];
            obj[name] = value;
        }
        return value;
	},
	
	getNum: function(obj, name) {
        var value = obj[name];
        if (!value) {
            value = 0;
            obj[name] = value;
        }
        return value;
	},
};
