var format    = require('util.format');

var harvestUtil = require('util.harvest');
var moveUtil    = require('util.move');
var roleUtil    = require('util.role');
var spawnUtil   = require('util.spawn');

var roleHarvester = require('role.harvester');
var roleUpgrader  = require('role.upgrader');
var roleBuilder   = require('role.builder');
var roleRepairer  = require('role.repairer');

var roles = [
    roleHarvester,
    roleUpgrader,
    roleBuilder,
    roleRepairer,
];

var version = 10;
var body = [
    WORK, WORK, WORK, WORK, WORK,
    CARRY, CARRY, CARRY, CARRY,
    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
];


    var PHASE_WORKING    = 'working';
    var PHASE_FETCHING   = 'fetching';
    var PHASE_HARVESTING = 'harvesting';

module.exports = {
    build: 'worker',
    
    spawn: function(role) {
        return spawnUtil.spawn(body, 'worker', role, version);
	},
	
	run: function(creeps) {
	    for (creep of creeps) {
	        this.runCreep(creep);
	    }
	},
	
	runCreep: function(creep) {
	    if (!creep.memory.phase) {
	        creep.memory.phase = PHASE_WORKING;
	    }
	    
	    
  	    if(creep.memory.phase === PHASE_WORKING && creep.carry.energy == 0) {
            creep.memory.phase = PHASE_FETCHING;
            creep.say('->Fetch');
	    } else if(creep.memory.phase !== PHASE_WORKING && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.phase = PHASE_WORKING;
	        creep.say("->wrk/"+creep.memory.role);
	        harvestUtil.returnSource(creep);
	    }

	    if(creep.memory.phase === PHASE_WORKING) {
	        //creep.say("W");
	        var role = this.findRole(creep);
	        if (!role) {
	            console.log("Unknown role! " + creep.memory.role);
	            roleUtil.convert(creep, 'upgrader');
	            return;
	        }
	        var hasWork = role.run(creep);
	        if (!hasWork) {
	            roleUtil.convert(creep, 'upgrader');
	        }
	    } else {
            //creep.say("F");
            var source = harvestUtil.requestStoredSource(creep);
            //console.log(creep.name + " - " + source.id);
            var r;
            
            if (!source) {
                moveUtil.chillax(creep);
            }
            
            r = creep.pickup(source);
            if (r == ERR_INVALID_TARGET) {
                r = creep.withdraw(source, RESOURCE_ENERGY);
                if (r == ERR_INVALID_TARGET) {
                    r = creep.harvest(source);
                }
            }
            
            if(r == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }  
	},
	
	findRole: function(creep) {
        for (role of roles) {
            if (creep.memory.role === role.role) {
                return role;
            }
        }
        return null;
	}
};
