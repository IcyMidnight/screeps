var format    = require('util.format');

var harvestUtil = require('util.harvest');
var moveUtil    = require('util.move');
var spawnUtil  = require('util.spawn');

var version = 3;
var body = [
    WORK, WORK, WORK, WORK, WORK, WORK,
    CARRY,
    MOVE, MOVE, MOVE
];

// var sources = {
//   '57ef9d9286f108ae6e60df37': {
//       pos: [6,43],
//       sourceId: '57ef9d9286f108ae6e60df37',
//       dest: [7,44],
//   },
//   '57ef9d9286f108ae6e60df38': {
//       pos: [13,42],
//       sourceId: '57ef9d9286f108ae6e60df38',
//       dest: [13,41],
//   },
// };


module.exports = {
    build: 'extractor',
    
    spawn: function(role) {
        return spawnUtil.spawn(body, this.build, role, version);
	},
	
	findSource: function(creep) {
	    var gameSource = harvestUtil.requestSource(creep);
	    var source = sources[gameSource.id];
	    console.log(source);
	    return source;
	},
	
	run: function(creeps) {
	    for (creep of creeps) {
        
            if (creep.memory.carrying && creep.carry.energy == 0) {
                creep.memory.carrying = false;
                creep.say('harvesting');
    	    } else if (!creep.memory.carrying && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.carrying = true;
    	        creep.say('carrying');
    	    }
            
            
            var structures = creep.pos.findInRange(FIND_STRUCTURES, 1)
            
            for (structure of structures) {
                if (structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_STORAGE) {
                        creep.transfer(structure, RESOURCE_ENERGY);
                }
            }
            
            
            if (creep.memory.carrying) {
                var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(structure) {
                        return ( 
                            (structure.structureType == STRUCTURE_CONTAINER ||
                             structure.structureType == STRUCTURE_STORAGE)
                            &&
                            (_.sum(structure.store) < structure.storeCapacity)
                        );
                    }
                });
                
                if(structure) {
                    if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
    	                harvestUtil.returnSource(creep);
                    }
                } else {
                    //moveUtil.chillax(creep);
                    creep.say("HALP!");
                }
            } else {
                var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 0);
                var r;
                
                if (droppedEnergy.length > 0) {
                    creep.say("p/u");
                    console.log("Trying to pick up " + droppedEnergy[0]);
                    r = creep.pickup(droppedEnergy[0]);
                }
                if (r != OK) {
                    var source = harvestUtil.requestSource(creep);
                    harvestUtil.takeSource(creep);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
	    }
	}
};
