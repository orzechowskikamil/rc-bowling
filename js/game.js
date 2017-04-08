window.rcBowling.game = (function () {

    var def = window.rcBowling.definitions;

    function listenToRemoteEvents() {
        var lastPressed = false;
        var forces = [];
        var forcesAmount = 50;

        window.rcBowling.connection.listen(function (data) {
            if (data.error) {
                throw new Error(data.error);
            }
            if (window.rcBowling.bowlingSet.ballDuringThrow) {
                return;
            }
            if (typeof data.acceleration !== 'object') {
                return;
            }

            var userHoldBall = data.pressed === true;
            if (userHoldBall) {
                forces.push(data.acceleration);
                if (forces.length > forcesAmount) {
                    forces.shift();
                }
            }

            var userReleaseBall = data.pressed === false && lastPressed === true;
            if (userReleaseBall) {
                var avgForce = forces.reduce(function (total, val, i, arr) {
                    total.x += val.x;
                    total.y += val.y;
                    total.z += val.z;
                    return total;
                }, {x: 0, y: 0, z: 0});

                throwBall(new BABYLON.Vector3(
                    avgForce.x * def.physics.mobileThrowForceAdjustment.x,
                    avgForce.y * def.physics.mobileThrowForceAdjustment.y,
                    avgForce.z * def.physics.mobileThrowForceAdjustment.z
                ));
            }

            lastPressed = data.pressed;
        });
    }


    function listenToMouseEvents() {
        document.body.addEventListener('mousemove', function (e) {
            if (window.rcBowling.bowlingSet.ballDuringThrow) {
                return;
            }
            var xPercent = e.screenX / window.screen.width;

            window.rcBowling.bowlingSet.bowlingBall.position = new BABYLON.Vector3(
                xPercent * def.floor.track.width - def.floor.track.width / 2,
                def.ball.initialPosition.y,
                def.ball.initialPosition.z
            );
        });

        document.body.addEventListener('mousedown', function (e) {
            if (window.rcBowling.bowlingSet.ballDuringThrow) {
                return;
            }

            var initialEvent = {x: e.screenX, y: e.screenY, timestamp: new Date().getTime()};

            var onMouseUp = function (e) {
                document.body.removeEventListener('mouseup', onMouseUp, true);

                var finalEvent = {x: e.screenX, y: e.screenY, timestamp: new Date().getTime()};

                var movement = {
                    x: finalEvent.x - initialEvent.x,
                    y: finalEvent.y - initialEvent.y,
                    duration: finalEvent.timestamp - initialEvent.timestamp
                };

                var forceAdjustment = def.physics.mouseThrowForceAdjustment;

                var throwForceVector = new BABYLON.Vector3(
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
        var id = setInterval(function () {
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

        var watchTrackIntervalID = setInterval(function () {
            if (!window.rcBowling.bowlingSet.isBallThrowFinished()) {
                return;
            }

            clearInterval(watchTrackIntervalID);

            setTimeout(function () {
                var knockedPins = window.rcBowling.bowlingSet.getAmountOfKnockedPins();
                alert('you knocked ' + knockedPins + ' pins!');
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