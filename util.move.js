module.exports = {
    /** @param {Creep} creep **/
    chillax: function(creep) {
        creep.say("Chillaxin'");
        var flag = Game.flags['Chillax'];
        creep.moveTo(flag);
	}
};
