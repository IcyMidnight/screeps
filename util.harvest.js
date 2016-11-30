var format   = require('util.format');

var roleUtil = require('util.role');

var harvestUtil = {
    requestSource: function(creep) {
        var counts = this.getCounts();
        
        if (counts.extractors >= 2 && creep.memory.build !== 'extractor') {
            console.log(creep.name + " no source for you");
            return null;
        }
        
        if (creep.memory.sourceId) {
            var source = Game.getObjectById(creep.memory.sourceId);
            if (source) {
                return source;
            }
            // console.log("Source expired: " + format.id(creep.memory.sourceId));
            delete creep.memory.sourceId;
        }

        var sources = creep.room.find(FIND_SOURCES);
        var bestSource = sources[0];
        var lowest = Infinity;
        for (i in sources) {
            var source = sources[i];
            var count = counts[source.id] || 0;
            // console.log("Source " + format.id(source.id) + " -> " + count);
            if (count < lowest) {
                lowest = count;
                bestSource = source;
            }
        }
        if (!bestSource) {
            return null;
        }
        
        creep.memory.sourceId = bestSource.id;
        //console.log("Assigning " + format.id(creep.memory.sourceId) + " to " + creep.name);

        return Game.getObjectById(creep.memory.sourceId);
	},
	
	requestStoredSource: function(creep) {
        if (creep.memory.sourceId) {

            var source = Game.getObjectById(creep.memory.sourceId);
            if (source) {
                return source;
            }
            // console.log("Source expired: " + format.id(creep.memory.sourceId));
            creep.say("Str Src!");
            delete creep.memory.sourceId;
        }
        
        var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (source) {
            console.log("Dropped energy available! " + source.id + " (" +source.pos.x+ "," +source.pos.y+ ")");
        }
        
        if (source) {
            if (Memory.droppedEnergy[source.id] && !Game.creeps[Memory.droppedEnergy[source.id]]) {
                delete Memory.droppedEnergy[source.id];
            }
            if (!Memory.droppedEnergy[source.id]) {
                console.log(creep.name + " getting dropped energy " + source.id + "!");
                creep.say("p/u dropped!");
                Memory.droppedEnergy[source.id] = creep.name;
                creep.memory.sourceId = source.id;
                return source;
            }
        }
	    
        var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure) {
                var isSource = (structure.structureType == STRUCTURE_CONTAINER)
                if (!isSource) {
                    return false;
                }
                var isGood = (structure.store[RESOURCE_ENERGY] > (structure.storeCapacity / 2));
                //console.log(structure.id + ": " + isGood + " - " + structure.store[RESOURCE_ENERGY]);
                return isGood;
            }
        });
	    
	    if (!structure) {
            structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    var isSource = structure.structureType == STRUCTURE_CONTAINER
                    if (!isSource) {
                        return false;
                    }
                    var isGood = (structure.store[RESOURCE_ENERGY] > 0);
                    //console.log(structure.id + ": " + isGood + " - " + structure.store[RESOURCE_ENERGY]);
                    return isGood;
                }
            });
	    }
	    
	    if (!structure) {
            structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    var isSource = (structure.structureType == STRUCTURE_CONTAINER ||
                                    structure.structureType == STRUCTURE_STORAGE)
                    if (!isSource) {
                        return false;
                    }
                    var isGood = (structure.store[RESOURCE_ENERGY] > 0);
                    //console.log(structure.id + ": " + isGood + " - " + structure.store[RESOURCE_ENERGY]);
                    
                    return isGood;
                }
            });
	    }
        if (!structure) {
            return this.requestSource(creep);
        }
        
        // TODO: store the container id and then filter above
        
        return structure;
	},
	
	returnSource: function(creep) {
	    if (!creep.memory.sourceId) {
	        console.log("Creep " + creep.name + " trying to return null resource");
	        return;
	    }
	    //console.log("Returning " + format.id(creep.memory.sourceId) + " from " + creep.name);
	    delete creep.memory.sourceId;
	    //this.rebalanceSources(creep.room);
	},
	
	takeSource: function(creep) {
	    if (!creep.memory.sourceId) {
	        console.log("Can't lock unrequested source");
	        return false;
	    }
	    var sourceId = creep.memory.sourceId;
	    for(var name in Game.creeps) {
            var otherCreep = Game.creeps[name];
            if (otherCreep !== creep && otherCreep.memory.sourceId === sourceId) {
                delete otherCreep.memory.sourceId;
            }
        }
	},
	
	rebalanceSources: function(room) {
	    var sources = room.find(FIND_SOURCES);
	    for (var i in sources) {
	        var source = sources[i];
	    }
	},
	
	getCounts: function() {
	    var counts = {};
	    var numExtractors = 0;
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.sourceId) {
                var count = counts[creep.memory.sourceId] || 0;
                counts[creep.memory.sourceId] = count + 1;
            }
            if (creep.memory.build === 'extractor') {
                numExtractors++;
            }
        }
        
        counts.extractors = numExtractors;
        Memory.counts = counts;
        return counts;
	},
	
	doGC: function() {
	    if (Memory.droppedEnergy) {
	        for (source in Memory.droppedEnergy) {
	            var creep = Game.creeps[Memory.droppedEnergy[source]];
	            if (!creep || creep.memory.sourceId !== source) {
	                console.log("Source " + source + " abandonned!");
	                delete Memory.droppedEnergy[source];
	            } 
	        }
	    } else {
	        Memory.droppedEnergy = {};
	    }
	},
};

module.exports = harvestUtil;
