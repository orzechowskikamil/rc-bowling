window.rcBowling.definitions = (function () {

    var def = {};

    def.debug = false;

    def.physics = {
        gravityVector: new BABYLON.Vector3(0, -9.81, 0),
        desiredFps: 60,
        solverIterations: 40,
        solverTolerance: 0.001,
        mouseThrowForceAdjustment: {x: 10, y: -0.05, z: 25},
        mobileThrowForceAdjustment: {x: 0.1, y: 0.2, z: 0.3}
    };
    def.physics.timeStep = 1 / def.physics.desiredFps;

    def.ball = {
        maxMass: 7.26,
        minMass: 2.20,
        mass: 7.26,
        maxDiameter: 0.21,
        minDiameter: 0.16,
        diameter: 0.21,
        friction: 0.2,
        restitution: 0.1,
        initialPosition: new BABYLON.Vector3(0, 0.5, 0),
        segments: 10
    };

    def.floor = {
        track: {
            width: 1,
            depth: 18,
            u: 5,
            v: 1,
            physics: true
        },
        left: {
            width: 5,
            depth: 17,
            u: 5,
            v: 5
        },
        right: {
            width: 5,
            depth: 17,
            u: 5,
            v: 5
        },
        front: {
            width: 10,
            depth: 3,
            u: 1,
            v: 15
        },
        height: 0.3,
        mass: 0,
        friction: 0.1,
        restitution: 0.1
    };

    def.sink = {
        width: 0.17,
        mass: 0,
        depth: 17,
    };


    def.floor.track.position = new BABYLON.Vector3(0, 0, def.floor.track.depth / 2);
    def.floor.left.position = new BABYLON.Vector3(
        def.floor.track.width / -2 + def.sink.width * -1 + def.floor.left.width / -2,
        0,
        def.floor.left.depth / 2
    );
    def.floor.right.position = new BABYLON.Vector3(
        def.floor.track.width / 2 + def.sink.width + def.floor.left.width / 2,
        0,
        def.floor.left.depth / 2
    );
    def.floor.front.position = new BABYLON.Vector3(0, 0, def.floor.front.depth / -2);

    def.pin = {
        height: 0.38,
        mass: 1.3,
        modelScale: 0.022,
        friction: 0.2,
        restitution: 0.1,
        pinSetPosition: {x: 0, y: 0.4, z: def.floor.track.depth - 0.9},
        spacing: {x: 0.13, z: 0.20},
        linearDamping: 0.3,
        angularDamping: 0.3,
        pinsInitialLayout: [
            {x: 0, z: 0},
            {x: -1, z: 1},
            {x: 1, z: 1},
            {x: -2, z: 2},
            {x: 0, z: 2},
            {x: 2, z: 2},
            {x: -1, z: 3},
            {x: 1, z: 3},
            {x: 3, z: 3},
            {x: -3, z: 3}
        ]
    };


    def.sink.leftSinkPosition = new BABYLON.Vector3(def.floor.track.width / -2 - def.sink.width / 2, 0.115, def.sink.depth / 2);
    def.sink.rightSinkPosition = new BABYLON.Vector3(def.floor.track.width / 2 + def.sink.width / 2, 0.115, def.sink.depth / 2);

    return def;
}());