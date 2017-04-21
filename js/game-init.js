(function(){

    var mode = window.location.search.split('mode=')[1];
    var remoteControllerEnabled = false;

    if (mode === 'remote') {
        remoteControllerEnabled = true;
    }


    var domContentLoaded = new Promise((resolve) => {
        window.document.addEventListener('DOMContentLoaded', function (e) {
            resolve();
        });
    });

    function pairWithController() {
        return new Promise((resolve) => {
            window.rcBowling.connection.getPeerId().then((peerId)=> {
                let serverUrl = location.href.match(/(.*)\/.*\.html/)[1];
                let controllerPageUrl = `${serverUrl}/controller.html?gameid=${peerId}`;

                new QRCode('controller-page-address-qr-code', {
                    text: controllerPageUrl,
                    correctLevel: QRCode.CorrectLevel.H
                });

                let controllerLinkDom = window.document.getElementById('controller-page-address-url');
                controllerLinkDom.setAttribute('href', controllerPageUrl);
                controllerLinkDom.textContent = controllerPageUrl;

                window.document.body.setAttribute('data-current-screen', 'pairing');

                window.rcBowling.connection.listen((data)=> {
                    if (data.connectedToGame === true) {
                        resolve();
                    }
                });
            });
        });
    }

    domContentLoaded.then(()=> {
        window.document.body.setAttribute('data-current-screen', 'before-load');

        if (remoteControllerEnabled) {
            window.rcBowling.remote = true;

            if (typeof window.fakeAccelerometerData === 'undefined') {
                return pairWithController();
            }
        }
    }).then(()=> {
        let canvasDom = document.getElementById('babylon-canvas');
        window.document.body.setAttribute('data-current-screen', 'game');
        window.rcBowling.scene.createScene(canvasDom);
    });


}());