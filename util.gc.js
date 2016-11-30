var harvestUtil = require('util.harvest');

module.exports = {
    doGC: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        harvestUtil.doGC();
    },
};
