var harvestUtil = require('util.harvest');
var moveUtil    = require('util.move');

module.exports = {
    role: 'repairer',
    
    run: function(creep) {
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(structure) {
                var direRampart = structure.structureType === STRUCTURE_RAMPART && structure.hits < 1000;
                if (direRampart) {
                    creep.say("Dire R!");
                    console.log("found dire rampart");
                }
                return direRampart;
            }
        });
        
        if (!structure) {
            structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType === STRUCTURE_WALL && structure.hits < 1000;
                }
            });
        }
        
        if (!structure) {
            structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.hits < structure.hitsMax / 2) &&
                        (structure.hitsMax < 1000000 || structure.hits < 10000); // Don't focus on walls too much for now
                }
            });
        }
        if (!structure) {
            structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.hits < structure.hitsMax / 1.5) &&
                        (structure.hitsMax < 1000000 || structure.hits < 25000); // Don't focus on walls too much for now
                }
            });
        }
        if (!structure) {
            structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.hits < structure.hitsMax / 1.2) &&
                        (structure.hitsMax < 1000000 || structure.hits < 50000); // Don't focus on walls too much for now
                }
            });
        }
        if (!structure) {
            structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.hits < structure.hitsMax) &&
                        (structure.hitsMax < 1000000 || structure.hits < 100000);
                }
            });
        }
        
        
        if (structure) {
            creep.moveTo(structure);
            creep.repair(structure);
            return true;
        }
        return false;
	}
};
