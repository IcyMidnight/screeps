var harvestUtil = require('util.harvest');
var moveUtil    = require('util.move');

module.exports =  {
    role: 'upgrader',
    
    run: function(creep) {
        creep.say('upg');
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
        return true;
    }
};
