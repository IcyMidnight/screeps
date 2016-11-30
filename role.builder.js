var harvestUtil = require('util.harvest');
var moveUtil    = require('util.move');

module.exports = {
    role: 'builder',
    
    run: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            var nonRoads = _.filter(targets, function(t) { return t.structureType !== STRUCTURE_ROAD});
            if (nonRoads.length > 0) {
                targets = nonRoads;
            }
            
            
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            return true;
        }
        return false;
	}
};
