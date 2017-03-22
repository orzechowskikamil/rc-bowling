window.rcBowling.bowlingSet = (function () {

    var ballMaterial;
    var pinMaterial;
    var bowlingBall;
    var pins;

    function loadMaterials(scene) {
        ballMaterial = new BABYLON.StandardMaterial('ball-texture', scene);
        ballMaterial.diffuseTexture = new BABYLON.Texture('assets/ball.png', scene);

        var pinTexture = new BABYLON.Texture('assets/pin.png', scene);
        pinTexture.uScale = 1;
        pinTexture.vScale = 1.9;
        pinMaterial = new BABYLON.StandardMaterial('pin-texture', scene);
        pinMaterial.diffuseTexture = pinTexture;
    }


    function addBowlingBallToScene(scene) {
        bowlingBall = BABYLON.Mesh.CreateSphere('bowling-ball', 100, def.ball.diameter, scene);
        bowlingBall.position = new BABYLON.Vector3(0, 1, 0);
        bowlingBall.material = ballMaterial;
        bowlingBall.impostor = new BABYLON.PhysicsImpostor(bowlingBall, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: def.ball.mass,
            friction: def.ball.friction,
            restitution: def.ball.restitution
        }, scene);
    }

    function addPinsToScene(scene) {
        var assetsManager = new BABYLON.AssetsManager(scene);

        return new Promise(function (resolve, reject) {
            var meshTask = assetsManager.addMeshTask('bowling task', '', "assets/", "bs.obj");

            setTimeout(function () {
                reject();
            }, 10 * 1000);

            meshTask.onSuccess = function (result) {
                var bowlingBallMeshFromOBJ = result.loadedMeshes[1];
                var pinMeshFromOBJ = result.loadedMeshes[0];
                bowlingBallMeshFromOBJ.dispose();

                var pinModelScaling = def.pin.modelScale * def.pin.height;
                pinMeshFromOBJ.scaling = new BABYLON.Vector3(pinModelScaling, pinModelScaling, pinModelScaling);
                pinMeshFromOBJ.material = pinMaterial;

                var pinPositions = [
                    {x: 0, z: 0},
                    {x: -1 * def.pin.spacing.x, z: def.pin.spacing.z},
                    {x: def.pin.spacing.x, z: def.pin.spacing.z},
                    {x: -2 * def.pin.spacing.x, z: 2 * def.pin.spacing.z},
                    {x: 0, z: 2 * def.pin.spacing.z},
                    {x: 2 * def.pin.spacing.x, z: 2 * def.pin.spacing.z},
                    {x: -1 * def.pin.spacing.x, z: 3 * def.pin.spacing.z},
                    {x: def.pin.spacing.x, z: 3 * def.pin.spacing.z},
                    {x: 3 * def.pin.spacing.x, z: 3 * def.pin.spacing.z},
                    {x: -3 * def.pin.spacing.x, z: 3 * def.pin.spacing.z},
                ];

                pins = [];

                pinPositions.forEach(function (val, i) {
                    var pinMesh = pinMeshFromOBJ.clone('pin-' + i);
                    pinMesh.position = new BABYLON.Vector3(val.x + def.pin.position.x, def.pin.position.y, val.z + def.pin.position.z);
                    pinMesh.impostor = new BABYLON.PhysicsImpostor(pinMesh, BABYLON.PhysicsImpostor.CylinderImpostor, {
                        mass: def.pin.mass,
                        friction: def.pin.friction,
                        restitution: def.pin.restitution,
                        nativeOptions: {
                            linearDamping: def.pin.linearDamping,
                            angularDamping: def.pin.angularDamping
                        }
                    }, scene);
                    pins.push(pinMesh);
                });
                pinMeshFromOBJ.dispose();

                resolve();
            }
            assetsManager.load();
        });
    }

    /**
     * @param scene
     * @returns Promise
     */
    function addBowlingSetToScene(scene) {
        loadMaterials(scene);
        addBowlingBallToScene(scene);
        return addPinsToScene(scene);
    }

    return {
        get bowlingBall() {
            return bowlingBall;
        },
        get pins() {
            return pins;
        },
        addBowlingSetToScene: addBowlingSetToScene
    }
}());