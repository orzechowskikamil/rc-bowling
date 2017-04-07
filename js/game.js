window.rcBowling.game = (function () {

    var def = window.rcBowling.definitions;

    function listenToRemoteEvents() {
        var xMovementBounds = 0.5;
        var last10Fx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        last10Fx.sum = function () {return this.reduce(function (total, val) { return total + val; }, 0);};
        var speedX = 0;

        //  var re = [];

        //lewo prawo stoplewo prawo stop
        var lastT;

        function ondata(data) {
            if (window.rcBowling.bowlingSet.ballDuringThrow) {
                return;
            }
            if (typeof data.acceleration !== 'object') {
                return;
            }

            // //todo gather data and remove
            //
            // re.push(data);
            // if (re.length === 400) {
            //     console.log(JSON.stringify(re, null));
            // }

            // speedX = 0;

            // last10Fx.push(data.acceleration.x);
            // last10Fx.shift();

            // var avgFx = last10Fx.sum() / last10Fx.length;
            // speedX += avgFx;


            var currentT = Date.now();
            if (typeof lastT === 'undefined') {
                lastT = currentT;
                return;
            }


            var dT = currentT - lastT;
            lastT = currentT;

            speedX += (data.acceleration.x/2000000000)/dT ;

            var bowlingBall = window.rcBowling.bowlingSet.bowlingBall;

            bowlingBall.position = bowlingBall.position.add(
                new BABYLON.Vector3(speedX /dT, 0, 0)
            );

            // if (bowlingBall.position.x < -1 * xMovementBounds) {bowlingBall.position.x = -1 * xMovementBounds}
            // if (bowlingBall.position.x > xMovementBounds) {bowlingBall.position.x = xMovementBounds}
        }


        if (window.fakeAccelerometerData) {
            setInterval(function () {
                ondata(window.fakeAccelerometerData.shift());
            }, 1);
        } else {
            window.rcBowling.connection.listen(ondata);
        }
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

                var forceAdjustment = def.physics.throwForceAdjustment;

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