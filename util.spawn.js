var format      = require('util.format');
var withDefault = require('util.withDefault');

var loopMem = require('util.loopMem');

module.exports =  {
    spawn: function(body, build, role, version) {
        var lastSpawn = Memory.lastSpawn;
        
        var memory = {
            build: build,
            role: role,
            version: version,
        }
        
        Memory.lastSpawn = Game.spawns['Spawn1'].createCreep(body, undefined, memory);
        
        if (lastSpawn == Memory.lastSpawn) {
            return null;
        }
        if (Memory.lastSpawn < 0) {
            console.log("Couldn't spawn " + build + "/" + role + ": " +
                format.error(Memory.lastSpawn) + " (" + Memory.lastSpawn + ")");
            return null;
        }
        
        console.log('Spawned new ' + build + "/" + role + ': ' + Memory.lastSpawn);
        return Memory.lastSpawn;
	},
	
	findSpawn: function() {
	    return Game.spawns['Spawn1'];
	},
	
	requestSpawn: function(priority, build, args) {
	    console.log("Spawn requested: ", priority, " - ", build.build , " (", args, ")")
	    var queues = withDefault.getArr(loopMem.get('util.spawn'), 'queues');
	    var queue = withDefault.getArr(queues, priority);
	    queue.push({
	        build: build,
	        args: args,
        });
	},
	
	executeQueues: function() {
	    var queues = loopMem.get('util.spawn').queues;
	    
	    var numSpawns = Object.keys(Game.spawns).length;
	    var numQueued = 0;
	    
	    
	    for (p in queues) {
	        var queue = queues[p];
	        for (request of queue) {
	            request.build.spawn.apply(request.build, request.args);
	            numQueued++;
	            if (numQueued >= numSpawns) {
	                break;
	            }
	        }
            if (numQueued >= numSpawns) {
                break;
            }
	    }
	},
	
	PRIORITY_DEFAULT:  5,
	PRIORITY_LAST:    10,
};
