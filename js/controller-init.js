(function(){

    var gamePeerId = window.location.search.split('=')[1];

    var domContentLoaded = new Promise((resolve)=> {
        window.document.addEventListener('DOMContentLoaded', () => {
            resolve();
        });
    });

    function wait(ms) {
        return new Promise((resolve) => {
            setTimeout(()=> {
                resolve();
            }, ms);
        });
    }

    function reportErrorIfDeviceMotionEventAbsent() {
        let resolveFirstDeviceMotion = () => {};
        let waitForDeviceMotionEventMs = 10000;

        new Promise((resolve, reject) => {
            resolveFirstDeviceMotion = resolve;

            setTimeout(()=> {
                reject();
            }, waitForDeviceMotionEventMs);
        }).catch(()=> {
            reportError('devicemotion seems to not fire properly');
        });

        return resolveFirstDeviceMotion;
    }

    function connectToGame(peerId) {
        return window.rcBowling.connection.getPeerId().then(()=> {
            return window.rcBowling.connection.connectToPeer(peerId);
        });
    }

    function reportError(message) {
        window.rcBowling.connection.send({error: message});
    }

    domContentLoaded.then(()=> {
        document.body.setAttribute('data-current-screen', 'pairing');
        return connectToGame(gamePeerId);
    }).then(()=> {
        window.rcBowling.connection.send({connectedToGame: true});
        document.body.setAttribute('data-current-screen', 'connected-to-game');
        return wait(2000);
    }).then(()=> {
        let pressed;

        let firstDeviceMotionHappened = reportErrorIfDeviceMotionEventAbsent();

        function onTouchStart() {
            pressed = true;
            document.body.setAttribute('data-current-screen', 'pressed');
        }

        function onTouchEnd() {
            pressed = false;
            document.body.setAttribute('data-current-screen', 'not-pressed');
        }

        function onDeviceMotion(e) {
            try {
                firstDeviceMotionHappened();

                if (typeof e.acceleration.x !== 'number') {
                    reportError('devicemotion acceleration seems to be null');
                }

                let dataToSend = {
                    acceleration: {
                        x: e.acceleration.x,
                        y: e.acceleration.y,
                        z: e.acceleration.z
                    },
                    rotation: {
                        alpha: e.rotationRate.alpha,
                        beta: e.rotationRate.beta,
                        gamma: e.rotationRate.gamma
                    },
                    pressed: pressed
                };

                window.rcBowling.connection.send(dataToSend);
            } catch (e) {
                reportError(e.message);
            }
        }


        try {
            onTouchEnd();
            document.addEventListener('mousedown', onTouchStart);
            document.addEventListener('touchstart', onTouchStart);
            document.addEventListener('mouseup', onTouchEnd);
            document.addEventListener('touchend', onTouchEnd);
            window.addEventListener('devicemotion', onDeviceMotion);
        } catch (e) {
            reportError(e.message);
        }
    });

}());