window.rcBowling.game = (function () {

    var def = window.rcBowling.definitions;

    function listenToRemoteEvents() {
        var lastPressed = false;
        var lastTimestamp;
        var forces = [];
        var forcesAmount = 50;
        var filter = new Kalman1DFilter();
        var v = 0, x = 0;

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

            var userHoldBall, userReleaseBall, userMovesWithBall;

            if (data.pressed === false) {
                if (lastPressed === true) {
                    userReleaseBall = true;
                } else {
                    userMovesWithBall = true;
                }
            } else {
                userHoldBall = true;
            }


            if (userMovesWithBall && lastTimestamp) {
                var fx = data.acceleration.x;
                var filteredFx = filter.getFilteredValue(fx);
                var dt = data.timestamp - lastTimestamp;
                var dv = filteredFx * dt / 1000;
                v = v + dv;
                var dx = v * dt / 1000;
                x = x + dx;

                if (x > 1) {
                    x = 1;
                    v = 0;
                }

                if (x < -1) {
                    x = -1;
                    v = 0;
                }


                window.rcBowling.bowlingSet.bowlingBall.position.x = x;
            }

            if (userHoldBall) {
                forces.push(data.acceleration);
                if (forces.length > forcesAmount) {
                    forces.shift();
                }
            }

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
            lastTimestamp = data.timestamp;
        });
    }

    function Kalman1DFilter() {

        var options = {
            stateTransition: 1.0,
            observation: 1.0,
            initialState: 1.0,
            initialCovariance: 1.0,
            processError: 0.001,
            measurementError: 0.001
        };

        var controlVector = $M([[0]]);
        var filter = new LinearKalmanFilter(
            $M([[options.stateTransition]]),
            $M([[0]]),
            $M([[options.observation]]),
            $M([[options.initialState]]),
            $M([[options.initialCovariance]]),
            $M([[options.processError]]),
            $M([[options.measurementError]])
        );

        this.getFilteredValue = function (noisyValue) {
            filter.predict(controlVector);
            filter.observe($M([[noisyValue]]));
            filter.update();

            var filteredValue = filter.getStateEstimate().e(1, 1);
            // var predictedState = filter.predictedStateEstimate.e(1, 1);
            // var predictedProbability = filter.predictedProbabilityEstimate.e(1, 1);
            // var covariance = filter.covarianceEstimate.e(1, 1);
            // var gain = filter.kalmanGain.e(1, 1);
            // var innovation = filter.innovation.e(1, 1);
            return filteredValue;
        };
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