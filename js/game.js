window.rcBowling.game = (function () {

    var def = window.rcBowling.definitions;

    function listenToRemoteEvents() {
        let lastPressed = false;
        let forces = [];
        let forcesAmount = 50;

        window.rcBowling.connection.listen((data)=> {
            if (data.error) {
                throw new Error(data.error);
            }
            if (window.rcBowling.bowlingSet.isBallDuringThrow()) {
                return;
            }
            if (typeof data.acceleration !== 'object') {
                return;
            }

            let userHoldBall = data.pressed === true;
            if (userHoldBall) {
                forces.push(data.acceleration);
                if (forces.length > forcesAmount) {
                    forces.shift();
                }
            }

            let userReleaseBall = data.pressed === false && lastPressed === true;
            if (userReleaseBall) {
                let avgForce = forces.reduce((sum, val)=>
                        ({x: sum.x + val.x, y: sum.y + val.y, z: sum.z + val.z}),
                    {x: 0, y: 0, z: 0});


                let forceAdjustment = def.physics.mobileThrowForceAdjustment;
                throwBall(new BABYLON.Vector3(
                    avgForce.x * forceAdjustment.x,
                    avgForce.y * forceAdjustment.y,
                    avgForce.z * forceAdjustment.z
                ));
            }

            lastPressed = data.pressed;
        });
    }


    function listenToMouseEvents() {
        document.body.addEventListener('mousemove', (e) => {
            if (window.rcBowling.bowlingSet.isBallDuringThrow()) {
                return;
            }
            let xPercent = e.screenX / window.screen.width;

            window.rcBowling.bowlingSet.getBowlingBall().position = new BABYLON.Vector3(
                xPercent * def.floor.floors.track.width - def.floor.floors.track.width / 2,
                def.ball.initialPosition.y,
                def.ball.initialPosition.z
            );
        });

        document.body.addEventListener('mousedown', (e)=> {
            if (window.rcBowling.bowlingSet.isBallDuringThrow()) {
                return;
            }

            let initialEvent = {x: e.screenX, y: e.screenY, timestamp: new Date().getTime()};

            let onMouseUp = function (e) {
                document.body.removeEventListener('mouseup', onMouseUp, true);

                let finalEvent = {x: e.screenX, y: e.screenY, timestamp: new Date().getTime()};

                let movement = {
                    x: finalEvent.x - initialEvent.x,
                    y: finalEvent.y - initialEvent.y,
                    duration: finalEvent.timestamp - initialEvent.timestamp
                };

                let forceAdjustment = def.physics.mouseThrowForceAdjustment;

                let throwForceVector = new BABYLON.Vector3(
                    movement.x * forceAdjustment.x / movement.duration,
                    movement.y * forceAdjustment.y,
                    Math.abs(movement.y) * forceAdjustment.z / movement.duration
                );
                throwBall(throwForceVector);
            };
            document.body.addEventListener('mouseup', onMouseUp, true);
        });
    }

    function waitForBallInMiddlewayAndMoveCameraToPins() {
        let id = setInterval(()=> {
            if (!window.rcBowling.bowlingSet.isBallCrossedMiddleOfTrack()) {
                return;
            }
            clearInterval(id);
            window.rcBowling.camera.moveToPins();
        }, 1);
    }

    function throwBall(throwForceVector) {
        window.rcBowling.bowlingSet.throwBall(throwForceVector);
        waitForBallInMiddlewayAndMoveCameraToPins();

    }

    function startGame() {
        if (window.rcBowling.remote) {
            listenToRemoteEvents();
        } else {
            listenToMouseEvents();
        }
        setUpShot();
    }

    function setUpShot() {
        window.rcBowling.bowlingSet.setUpPinsAndBall();

        let watchTrackIntervalID = setInterval(() => {
            if (!window.rcBowling.bowlingSet.isBallThrowFinished()) {
                return;
            }

            clearInterval(watchTrackIntervalID);

            setTimeout(()=> {
                let knockedPins = window.rcBowling.bowlingSet.getAmountOfKnockedPins();
                alert(`you knocked ${knockedPins} pins!`);
                window.rcBowling.camera.moveToBeginning();
                setUpShot();
            }, 5 * 1000);
        }, 1000);
    }


    return {
        startGame: startGame,
        setUpShot: setUpShot
    };
}());