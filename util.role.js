module.exports = {
    DEFAULT_ROLE: 'default',
    
    convert: function(creep, dst) {
        var src = creep.memory.role;
        var memory = {
            build: creep.memory.build,
            role: dst,
            version: creep.memory.version,
        };
        
        creep.memory = memory;
        console.log("Gave " + src + " " + creep.name + " role " + dst);
        return creep.name;
	},
	
	convertAny: function(build, src, dst) {
        var candidate = null;
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.build != build) {
                continue;
            }
            if(!creep.memory.role) {
                creep.memory.role = dst;
                console.log("Gave unassigned " + creep.name + " role " + dst);
                return creep.name;
            }
            if (creep.memory.role == src) {
                candidate = creep;
            }
        }
        if (!candidate) {
            return null;
        }
        
        return this.convert(candidate, dst);
	},
	
	hasRole: function(creep, role) {
	    return role === creep.memory.role;
	},
};
