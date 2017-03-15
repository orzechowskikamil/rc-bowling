window.rcBowling.definitions = (function () {

    var definitions = {};

    definitions.gravityVector = new BABYLON.Vector3(0, -9.81, 0);

    definitions.throw = {
        force: 50,
        randomness: 15
    };

    definitions.ball = {
        maxMass: 7.26,
        minMass: 2.20,
        mass: 7.26,
        maxDiameter: 0.21,
        minDiameter: 0.16,
        diameter: 0.21,
        friction: 0.1,
        restitution: 0.1
    };

    definitions.track = {
        width: 1,
        height: 0.3,
        depth: 18,
        mass: 0,
        friction: 1,
        restitution: 0.1
    };
    definitions.track.position = new BABYLON.Vector3(0, 0, definitions.track.depth / 2);

    definitions.pin = {
        height: 0.38,
        mass: 1.5,
        modelScale: 0.025,
        friction: 1,
        restitution: 0.1,
        position: {x: 0, y: 2, z: definitions.track.depth - 0.9},
        spacing: {x: 0.13, z: 0.20},
        linearDamping: 0.5,
        angularDamping: 0.5
    };

    definitions.sink = {
        width: 0.17,
        height: 0.25,
        mass: 0,
        depth: 18
    };

    definitions.sinkWall = {
        width: 0.1,
        height: 0.3,
        mass: 0,
        depth: 18
    };


    return definitions;
}());