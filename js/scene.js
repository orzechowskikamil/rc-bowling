window.rcBowling.scene = (function () {

    function createScene(canvasDom) {
        let engine = new BABYLON.Engine(canvasDom, true);
        let backgroundColor = new BABYLON.Color3(0, 0, 0);
        let def = window.rcBowling.definitions;


        let scene = new BABYLON.Scene(engine);
        if (def.debug) {
            scene.debugLayer.show();
        }

        scene.enablePhysics(def.physics.gravityVector, new BABYLON.CannonJSPlugin());
        let physicsEngine = scene.getPhysicsEngine();
        let physicsPlugin = physicsEngine._physicsPlugin;
        let world = physicsPlugin.world;
        physicsEngine.setTimeStep(def.physics.timeStep);
        world.solver.iterations = def.physics.solverIterations;
        world.solver.tolerance = def.physics.solverTolerance;
        scene.clearColor = backgroundColor;

        window.rcBowling.bowlingSet.addBowlingSetToScene(scene).then(()=> {
            let bowlingBall = window.rcBowling.bowlingSet.getBowlingBall();
            window.rcBowling.track.addTrackToScene(scene);
            window.rcBowling.lights.initLights(scene);
            window.rcBowling.camera.initCamera(scene, canvasDom);
            window.rcBowling.lights.addToRenderShadowList(bowlingBall);
            window.rcBowling.bowlingSet.getPins().forEach((pin)=> {
                window.rcBowling.lights.addToRenderShadowList(pin);
            });
            window.rcBowling.game.startGame();
            engine.runRenderLoop(()=> {
                scene.render();
            });
        });

        window.addEventListener("resize", ()=> {
            engine.resize();
        });
    }

    return {
        createScene: createScene
    };
}());