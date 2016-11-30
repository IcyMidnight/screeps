var ERROR_LOOKUP = {};
ERROR_LOOKUP[OK] = "OK";
ERROR_LOOKUP[ERR_NOT_OWNER] = "ERR_NOT_OWNER";
ERROR_LOOKUP[ERR_NO_PATH] = "ERR_NO_PATH";
ERROR_LOOKUP[ERR_NAME_EXISTS] = "ERR_NAME_EXISTS";
ERROR_LOOKUP[ERR_BUSY] = "ERR_BUSY";
ERROR_LOOKUP[ERR_NOT_FOUND] = "ERR_NOT_FOUND";
ERROR_LOOKUP[ERR_NOT_ENOUGH_EXTENSIONS] = "ERR_NOT_ENOUGH_EXTENSIONS";
ERROR_LOOKUP[ERR_NOT_ENOUGH_RESOURCES] = "ERR_NOT_ENOUGH_RESOURCES";
ERROR_LOOKUP[ERR_NOT_ENOUGH_ENERGY] = "ERR_NOT_ENOUGH_ENERGY";
ERROR_LOOKUP[ERR_INVALID_TARGET] = "ERR_INVALID_TARGET";
ERROR_LOOKUP[ERR_FULL] = "ERR_FULL";
ERROR_LOOKUP[ERR_NOT_IN_RANGE] = "ERR_NOT_IN_RANGE";
ERROR_LOOKUP[ERR_INVALID_ARGS] = "ERR_INVALID_ARGS";
ERROR_LOOKUP[ERR_TIRED] = "ERR_TIRED";
ERROR_LOOKUP[ERR_NO_BODYPART] = "ERR_NO_BODYPART";
ERROR_LOOKUP[ERR_RCL_NOT_ENOUGH] = "ERR_RCL_NOT_ENOUGH";
ERROR_LOOKUP[ERR_GCL_NOT_ENOUGH] = "ERR_GCL_NOT_ENOUGH";

var formatUtil = {
    /** @param {Creep} creep **/
    id: function(s) {
        return s.substring(s.length - 4);
	},
	
	error: function(e) {
	    return ERROR_LOOKUP[e];
	},
};

module.exports = formatUtil;