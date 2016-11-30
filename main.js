var roleUtil      = require('util.role');
var spawnUtil     = require('util.spawn');
var loopMem       = require('util.loopMem');
var gc            = require('util.gc');
var withDefault   = require('util.withDefault');

var workerBuild    = require('build.worker');
var extractorBuild = require('build.extractor');

module.exports.loop = function () {
    var roomName = 'W9N68';
    loopMem.newLoop();
    //require('util.spawn').requestSpawn(5, require('build.worker'), ['builder']);
    //require('util.role').convertAny('worker', 'upgrader', 'builder');
    
    gc.doGC();

    var builds = {};
    
    for (name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.build == 'extractor' && creep.ticksToLive < 50) {
            spawnUtil.requestSpawn(spawnUtil.PRIORITY_DEFAULT, extractorBuild, [roleUtil.DEFAULT_ROLE]);
        }
        
        var build = withDefault.getObj(builds, creep.memory.build);
        var role = creep.memory.role || roleUtil.DEFAULT_ROLE;
        build[role] = withDefault.getNum(build, role) + 1;
        //console.log(creep.memory.build + "/" + role + " - " + name);
    }
    
    var sortedBuilds = _.sortBy(Object.keys(builds));
    for (build of sortedBuilds) {
        var roles = builds[build];
        var msg = "  " + build + "(" + _.sum(roles) +  "):\n    ";
        var sortedRoles = _.sortBy(Object.keys(roles));
        for (role of sortedRoles) {
            msg = msg + role + ": " + roles[role] + " ";
        }
        console.log(msg);
    }



    var extractors = _.filter(Game.creeps, (creep) => creep.memory.build == 'extractor');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role  == 'harvester');
    var upgraders  = _.filter(Game.creeps, (creep) => creep.memory.role  == 'upgrader');
    var repairers  = _.filter(Game.creeps, (creep) => creep.memory.role  == 'repairer');
    var builders   = _.filter(Game.creeps, (creep) => creep.memory.role  == 'builder');

    var constructionUnitsNeeded = 0;
    for (i in Game.constructionSites) {
        var site = Game.constructionSites[i];
        constructionUnitsNeeded += site.progressTotal - site.progress;
    }
    //console.log("c needed: " + constructionUnitsNeeded);

    var desiredHarvesters = 4;
    var desiredUpgraders = 2;
    var desiredRepairers = 3;// - Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}).length;
    var desiredBuilders = Math.min(6, Math.ceil(constructionUnitsNeeded / 100));
    //console.log("desireed builders: " + desiredBuilders);
    var desiredTotal = 16;

    var numCreeps = Object.keys(Game.creeps).length;

    if (numCreeps <= 2) {
        desiredHarvesters = 1;
        desiredUpgraders = 1;
    } else if (numCreeps <= 3) {
        desiredHarvesters = 2;
        desiredUpgraders = 1;
    }

    if (extractors.length < 2) {
        spawnUtil.requestSpawn(spawnUtil.PRIORITY_DEFAULT, extractorBuild, [roleUtil.DEFAULT_ROLE]);
    }

    if(harvesters.length < desiredHarvesters) {
        if (harvesters.length == 0 || upgraders.length > 1) {
            roleUtil.convertAny('worker', 'upgrader', 'harvester');
        }
    }
    if(upgraders.length < desiredUpgraders) {
        if (builders.length > 0) {
            roleUtil.convertAny('worker', 'builder', 'upgrader');
        } else if (harvesters.length > 1 && upgraders.length == 0) {
            roleUtil.convertAny('worker', 'harvester', 'upgrader');
        }
    }
    if(repairers.length < desiredRepairers) {
        if (upgraders.length > desiredUpgraders) {
            roleUtil.convertAny('worker', 'upgrader', 'repairer');
        } else {
            spawnUtil.requestSpawn(spawnUtil.PRIORITY_DEFAULT, workerBuild, ['repairer']);
        }
    }
    if(builders.length < desiredBuilders) {
        if (upgraders.length > desiredUpgraders) {
            roleUtil.convertAny('worker', 'upgrader', 'builder');
        } else {
            spawnUtil.requestSpawn(spawnUtil.PRIORITY_DEFAULT, workerBuild, ['builder']);
        }
    }

    if (builders.length > desiredBuilders) {
        console.log("Too many builders");
        var numToConvert = builders.length - desiredBuilders;
        for (var i = 0; i < numToConvert; i++) {
            if (repairers.length < desiredRepairers) {
                roleUtil.convertAny('worker', 'builder', 'repairer');
            } else {
                roleUtil.convertAny('worker', 'builder', 'upgrader');
            }
        }
    }
    
    numCreeps = Object.keys(Game.creeps).length;
    if (numCreeps < desiredTotal) {
        //console.log("Too few creeps: found " + numCreeps + " wanted " + desiredTotal);
        spawnUtil.requestSpawn(spawnUtil.PRIORITY_DEFAULT, workerBuild, ['upgrader']);
    }
    if (numCreeps <= 3) {
        if (numCreeps == 0 || numCreeps == 2) {
            spawnUtil.spawn([WORK, WORK, CARRY, MOVE], 'worker', 'harvester', 1);
        } else if (numCreeps == 1) {
            spawnUtil.spawn([WORK, WORK, CARRY, MOVE], 'worker', 'upgrader', 1);
        }
    }

    spawnUtil.executeQueues();


    var extractors = [];
    var workers = [];

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var build = creep.memory.build;
        if (build == extractorBuild.build) {
            extractors.push(creep);
        } else if (build == workerBuild.build) {
            workers.push(creep);
        } else {
            console.log("Unknown build! " + build);
        }
    }
    
    extractorBuild.run(extractors);
    workerBuild.run(workers);
    
    var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES,
        {filter: {structureType: STRUCTURE_TOWER}});
    
    for (tower of towers) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            try {
                var username = closestHostile.owner.username;
                Game.notify(`User ${username} spotted in room ${roomName}`);
            } catch (err) {
                Game.notify(err);
            }
        } else {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => ((structure.hits < (structure.hitsMax * 0.9)) &&
                    (structure.hitsMax < 1000000 ||
                        structure.hits < ((tower.energy < tower.energyCapacity / 2) ? 1000 : 25000)))
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
    
    
    // var roads = _.filter(Game.constructionSites, (site) => site.structureType == STRUCTURE_ROAD);
    // var walls = _.filter(Game.constructionSites, (site) => site.structureType == STRUCTURE_WALL);
    
    // for (var n in walls) {
    //     var s = walls[n];
    //     s.remove();
    // }
}
