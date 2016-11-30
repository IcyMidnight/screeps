var harvestUtil = require('util.harvest');
var moveUtil    = require('util.move');
var format      = require('util.format');

module.exports =  {
    role: 'harvester',
    
    run: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
        });
        
        if (targets.length === 0) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity / 2;
                }
            });
        }
        
        if (targets.length === 0) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
        }
        
        if(targets.length === 0) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE &&
                        structure.energy < structure.energyCapacity;
                }
            });
        }
        
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            return true;
        }
        return false;
	}
};
