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

        let pinTexture = new BABYLON.Texture('assets/pin.png', scene);
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
        let invisiblePositionVector = new BABYLON.Vector3(100, -100, -100);
        bowlingBall.position = invisiblePositionVector;
    }

    function placePins() {
        pins.forEach((pinMesh, i) => {
            let pinPositionInLayout = def.pin.pinsInitialLayout[i];

            pinMesh.rotationQuaternion = BABYLON.Quaternion.Identity();
            pinMesh.impostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
            pinMesh.impostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            setTimeout(()=> {
                pinMesh.position = new BABYLON.Vector3(
                    pinPositionInLayout.x * def.pin.spacing.x + def.pin.pinSetPosition.x,
                    def.pin.pinSetPosition.y,
                    pinPositionInLayout.z * def.pin.spacing.z + def.pin.pinSetPosition.z
                );
            }, 1);
        });
    }

    function addPinsToScene(scene) {
        let assetsManager = new BABYLON.AssetsManager(scene);

        return new Promise((resolve, reject)=> {
            let meshTask = assetsManager.addMeshTask('bowling task', '', "assets/", "bs.obj");

            setTimeout(()=> {
                reject();
            }, 10 * 1000);

            meshTask.onSuccess = function (result) {
                let bowlingBallMeshFromOBJ = result.loadedMeshes[1];
                let pinMeshFromOBJ = result.loadedMeshes[0];
                bowlingBallMeshFromOBJ.dispose();

                let pinModelScaling = def.pin.modelScale * def.pin.height;
                pinMeshFromOBJ.scaling = new BABYLON.Vector3(pinModelScaling, pinModelScaling, pinModelScaling);
                pinMeshFromOBJ.material = pinMaterial;

                pins = [];

                for (let i = 0, max = def.pin.pinsInitialLayout.length; i < max; i++) {
                    let pinMesh = pinMeshFromOBJ.clone(`pin-${i}`);
                    pinMesh.numberInLayout = i;

                    let invisiblePosition = new BABYLON.Vector3(-100 * i, -100, -100);
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
        setTimeout(()=> {
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
        return pins.reduce((total, val, i, arr)=> {
            let yR = val.rotationQuaternion.toEulerAngles().y;
            let y = val.position.y;
            let pinKnockedOut = yR > 0.3 || yR < -0.3;
            let pinFallUnderTrack = y < def.floor.floors.track.position.y - 1;

            return total + (pinKnockedOut || pinFallUnderTrack ? 1 : 0);
        }, 0);
    }

    function isBallThrowFinished() {
        if (!ballDuringThrow) {return false;}

        let pos = bowlingBall.position;
        let v = bowlingBall.impostor.getLinearVelocity();

        let ballOutsideTrack = pos.z > def.floor.floors.track.depth
            || pos.x > def.floor.floors.track.width
            || pos.x < def.floor.floors.track.width * -1
            || pos.y < def.floor.floors.track.position.y - 1;

        let ballStopped = v.x < 0.01 && v.y < 0.01 && v.z < 0.01;

        return ballOutsideTrack || ballStopped;
    }


    function setUpPinsAndBall() {
        placeBall();
        placePins();
    }

    function isBallCrossedMiddleOfTrack() {
        if (!ballDuringThrow) {
            return false;
        }

        let middleOfTrackZ = def.floor.floors.track.depth / 2;

        return bowlingBall.position.z > middleOfTrackZ;
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
        getBowlingBall() {
            return bowlingBall;
        },
        getPins() {
            return pins;
        },
        isBallDuringThrow() {
            return ballDuringThrow;
        },
        addBowlingSetToScene: addBowlingSetToScene,
        throwBall: throwBall,
        getAmountOfKnockedPins: getAmountOfKnockedPins,
        setUpPinsAndBall: setUpPinsAndBall,
        isBallThrowFinished: isBallThrowFinished,
        isBallCrossedMiddleOfTrack: isBallCrossedMiddleOfTrack

    }
}());