window.rcBowling.bowlingSet = (function () {
    var def = window.rcBowling.definitions;

    var ballMaterial;
    var pinMaterial;
    var bowlingBall;
    var pins;
    var ballDuringThrow = false;

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
        bowlingBall = BABYLON.Mesh.CreateSphere('bowling-ball', def.ball.segments, def.ball.diameter, scene);
        bowlingBall.material = ballMaterial;
        bowlingBall.impostor = new BABYLON.PhysicsImpostor(bowlingBall, BABYLON.PhysicsImpostor.SphereImpostor, {
            friction: def.ball.friction,
            restitution: def.ball.restitution,
            mass: def.ball.mass
        }, scene);

        // hide ball initially to avoid problems
        var invisiblePositionVector = new BABYLON.Vector3(100, -100, -100);
        bowlingBall.position = invisiblePositionVector;
    }

    function placePins() {
        pins.forEach(function (pinMesh, i) {
            var pinPositionInLayout = def.pin.pinsInitialLayout[i];

            pinMesh.rotationQuaternion = BABYLON.Quaternion.Identity();
            pinMesh.impostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
            pinMesh.impostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            setTimeout(function () {
                pinMesh.position = new BABYLON.Vector3(
                    pinPositionInLayout.x * def.pin.spacing.x + def.pin.pinSetPosition.x,
                    def.pin.pinSetPosition.y,
                    pinPositionInLayout.z * def.pin.spacing.z + def.pin.pinSetPosition.z
                );
            }, 1);
        });
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

                pins = [];

                for (var i = 0, max = def.pin.pinsInitialLayout.length; i < max; i++) {
                    var pinMesh = pinMeshFromOBJ.clone('pin-' + i);
                    pinMesh.numberInLayout = i;

                    var invisiblePosition = new BABYLON.Vector3(-100 * i, -100, -100);
                    pinMesh.position = invisiblePosition;

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
                }
                pinMeshFromOBJ.dispose();
                resolve();
            }
            assetsManager.load();
        });
    }

    function throwBall(throwForceVector) {
        if (ballDuringThrow) {
            throw new Error('ball was already thrown. reset position of everything before another shot');
        }
        ballDuringThrow = true;
        // now ball require real mass
        bowlingBall.impostor.setMass(def.ball.mass);
        // seems very stupid, but applying a force don't work just after changing mass.
        // It's required to do small timeout.
        setTimeout(function () {
            bowlingBall.impostor.applyImpulse(throwForceVector, bowlingBall.getAbsolutePosition());
        }, 1);
    }

    function placeBall() {
        ballDuringThrow = false;
        // ball must have 0 mass to float above floor
        bowlingBall.impostor.setMass(0);
        bowlingBall.position = def.ball.initialPosition.clone();

        bowlingBall.impostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
        bowlingBall.impostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
    }

    function getAmountOfKnockedPins() {
        return pins.reduce(function (total, val, i, arr) {
            var yR = val.rotationQuaternion.toEulerAngles().y;
            var y = val.position.y;
            var pinKnockedOut = yR > 0.3 || yR < -0.3;
            var pinFallUnderTrack = y < def.floor.track.position.y - 1;

            return total + (pinKnockedOut || pinFallUnderTrack ? 1 : 0);
        }, 0);
    }

    function isBallThrowFinished() {
        if (!ballDuringThrow) {return false;}

        var pos = bowlingBall.position;
        var v = bowlingBall.impostor.getLinearVelocity();

        var ballOutsideTrack = pos.z > def.floor.track.depth
            || pos.x > def.floor.track.width
            || pos.x < def.floor.track.width * -1
            || pos.y < def.floor.track.position.y - 1;

        var ballStopped = v.x < 0.01 && v.y < 0.01 && v.z < 0.01;

        return ballOutsideTrack || ballStopped;
    }


    function setUpPinsAndBall() {
        placeBall();
        placePins();
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
        get ballDuringThrow() {
            return ballDuringThrow;
        },
        addBowlingSetToScene: addBowlingSetToScene,
        throwBall: throwBall,
        getAmountOfKnockedPins: getAmountOfKnockedPins,
        setUpPinsAndBall: setUpPinsAndBall,
        isBallThrowFinished: isBallThrowFinished
    }
}());