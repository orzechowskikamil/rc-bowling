window.rcBowling.definitions = (function () {

    var def = {};

    def.gravityVector = new BABYLON.Vector3(0, -9.81, 0);

    def.throw = {
        force: 50,
        randomness: 5
    };

    def.ball = {
        maxMass: 7.26,
        minMass: 2.20,
        mass: 7.26,
        maxDiameter: 0.21,
        minDiameter: 0.16,
        diameter: 0.21,
        friction: 0.1,
        restitution: 0.1
    };

    def.floor = {
        track: {
            width: 1,
            depth: 18,
            u: 5,
            v: 1,
        },
        left: {
            width: 5,
            depth: 18,
            u: 5,
            v: 5
        },
        right: {
            width: 5,
            depth: 18,
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
        friction: 1,
        restitution: 0.1
    };

    def.sink = {
        width: 0.17,
        mass: 0,
        depth: 18,
    };


    def.floor.track.position = new BABYLON.Vector3(0, 0, def.floor.track.depth / 2);
    def.floor.left.position = new BABYLON.Vector3(def.floor.track.width / -2 + def.sink.width * -1 + def.floor.left.width / -2, 0, def.floor.left.depth / 2);
    def.floor.right.position = new BABYLON.Vector3(def.floor.track.width / 2 + def.sink.width + def.floor.left.width / 2, 0, def.floor.left.depth / 2);
    def.floor.front.position = new BABYLON.Vector3(0, 0, def.floor.front.depth / -2);

    def.pin = {
        height: 0.38,
        mass: 1.5,
        modelScale: 0.019,
        friction: 1,
        restitution: 0.1,
        position: {x: 0, y: 0.30, z: def.floor.track.depth - 0.9},
        spacing: {x: 0.13, z: 0.20},
        linearDamping: 0.5,
        angularDamping: 0.5
    };


    def.sink.leftSinkPosition = new BABYLON.Vector3(def.floor.track.width / -2 - def.sink.width / 2, 0.115, def.sink.depth / 2);
    def.sink.rightSinkPosition = new BABYLON.Vector3(def.floor.track.width / 2 + def.sink.width / 2, 0.115, def.sink.depth / 2);

    return def;
}());