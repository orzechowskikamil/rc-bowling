window.rcBowling.camera = (function () {

    var camera;
    var scene;

    var coords = {
        beginning: {
            position: new BABYLON.Vector3(0, 1.5, -3),
            target: new BABYLON.Vector3(0, 0.9, 2)
        },
        pins: {
            position: new BABYLON.Vector3(0, 1.5, 14),
            target: new BABYLON.Vector3(0, 0.9, 18)
        }
    };

    function initCamera(sceneP) {
        scene = sceneP;
        camera = new BABYLON.TargetCamera("camera", BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, false);
        camera.inertia=5;
        camera.speed=5;
        moveToBeginning();
    }


    function moveToPins() {
        // debugger
        // var cameraBeginningAnimation = new BABYLON.Animation(
        //     'anim',
        //     'position',
        //     30,
        //     BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        //     BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        // );
        // cameraBeginningAnimation.setKeys([
        //     {frame: 0, value: coords.beginning.position},
        //     {frame: 30, value: coords.pins.position}
        // ]);
        // camera.animations.push(cameraBeginningAnimation);
        // scene.beginAnimation(camera, 0, 30, false);


         camera.position = coords.pins.position;
        camera.setTarget(coords.pins.target);
    }

    function moveToBeginning() {
        camera.position = coords.beginning.position;
        camera.setTarget(coords.beginning.target);
    }

    return {
        moveToPins: moveToPins,
        moveToBeginning: moveToBeginning,
        initCamera: initCamera
    };
}());