window.rcBowling.game = (function () {

    function listenToMouseEvents() {
        document.body.addEventListener('mousemove', function (e) {
            if (ballDuringThrow) {
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
            if (ballDuringThrow) {
                return;
            }
            ballDuringThrow = true;

            var initialEvent = {x: e.screenX, y: e.screenY, timestamp: new Date().getTime()};

            var onMouseUp = function (e) {
                document.body.removeEventListener('mouseup', onMouseUp, true);

                var finalEvent = {x: e.screenX, y: e.screenY, timestamp: new Date().getTime()};

                var movement = {
                    x: finalEvent.x - initialEvent.x,
                    y: finalEvent.y - initialEvent.y,
                    duration: finalEvent.timestamp - initialEvent.timestamp
                };

                var forceAdjustment = {x: 2, y: -0.05, z: 25};

                var throwForceVector = new BABYLON.Vector3(
                    movement.x * forceAdjustment.x / movement.duration,
                    movement.y * forceAdjustment.y,
                    Math.abs(movement.y) * forceAdjustment.z / movement.duration
                );
                window.rcBowling.bowlingSet.throwBall(throwForceVector);
            };
            document.body.addEventListener('mouseup', onMouseUp, true);
        });
    }

    return {
        listenToMouseEvents: listenToMouseEvents
    };
}());