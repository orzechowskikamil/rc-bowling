window.rcBowling.scene = (function () {

    function createScene(canvasDom) {
        var engine = new BABYLON.Engine(canvasDom, true);
        var backgroundColor = new BABYLON.Color3(0, 0, 0);
        var def = window.rcBowling.definitions;


        var scene = new BABYLON.Scene(engine);
        if (def.debug) {
            scene.debugLayer.show();
        }

        scene.enablePhysics(def.physics.gravityVector, new BABYLON.CannonJSPlugin());
        var physicsEngine = scene.getPhysicsEngine();
        var physicsPlugin = physicsEngine._physicsPlugin;
        var world = physicsPlugin.world;
        physicsEngine.setTimeStep(def.physics.timeStep);
        world.solver.iterations = def.physics.solverIterations;
        world.solver.tolerance = def.physics.solverTolerance;
        scene.clearColor = backgroundColor;

        window.rcBowling.bowlingSet.addBowlingSetToScene(scene).then(function () {
            var bowlingBall = window.rcBowling.bowlingSet.bowlingBall;
            window.rcBowling.track.addTrackToScene(scene);
            window.rcBowling.lights.initLights(scene);
            window.rcBowling.camera.initCamera(scene, canvasDom);
            window.rcBowling.lights.addToRenderShadowList(bowlingBall);
            window.rcBowling.bowlingSet.pins.forEach(function (pin) {
                window.rcBowling.lights.addToRenderShadowList(pin);
            });
            window.rcBowling.game.startGame();
            engine.runRenderLoop(function () {
                scene.render();
            });
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    }

    return {
        createScene: createScene
    };
}());