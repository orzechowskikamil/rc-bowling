window.rcBowling.connection = (function () {

    // I don't need p2p connection between more than 2 peers (only game <-> controller),
    // so multi peer cases are ignored.


    /**
     * Api key took from peer.js tutorial. Replace with your own.
     */
    var apiKey = 'lwjd5qra8257b9';
    var peer;
    var peerId;
    var currentConnection;
    var onReceiveCallback = function () {};

    /**
     * @param id
     * @returns {Promise}
     */
    function getPeerId() {
        return new Promise((resolve, reject)=> {
            peer = new Peer({key: apiKey});
            peer.on('open', (id)=> {
                peerId = id;
                peer.on('connection', (incomingConnection) => {
                    currentConnection = incomingConnection;
                    currentConnection.on('data', (data) => {
                        onReceiveCallback.call(null, data);
                    });
                });
                resolve(peerId);
            });
        });
    }

    function send(data) {
        currentConnection.send(data);
    }


    function listen(onReceive) {
        onReceiveCallback = onReceive;
    }


    function connectToPeer(peerId) {
        return new Promise((resolve, reject)=> {
            currentConnection = peer.connect(peerId);
            currentConnection.on('open', ()=> {
                resolve();
            });
        });
    }

    return {
        connectToPeer: connectToPeer,
        listen: listen,
        send: send,
        getPeerId: getPeerId
    };
}());