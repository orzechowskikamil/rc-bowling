window.rcBowling.track = (function () {

    var def = window.rcBowling.definitions;


    function addTrackToScene(scene) {
        var woodMaterial = new BABYLON.StandardMaterial('track-texture', scene);
        var woodTexture = new BABYLON.Texture('assets/track.jpg', scene);
        woodTexture.uScale = 5;
        woodTexture.vScale = 1;
        woodMaterial.diffuseTexture = woodTexture;


        var plasticMaterial = new BABYLON.StandardMaterial('plastic-texture', scene);
        var plasticTexture = new BABYLON.Texture('assets/plastic.jpg', scene);
        plasticTexture.uScale = 5;
        plasticTexture.vScale = 1;
        plasticMaterial.diffuseTexture = plasticTexture;


        var trackMesh = BABYLON.MeshBuilder.CreateBox('track', {
            width: def.track.width,
            height: def.track.height,
            depth: def.track.depth
        }, scene);
        trackMesh.position = def.track.position;
        trackMesh.receiveShadows = true;
        trackMesh.material = woodMaterial;
        trackMesh.impostor = new BABYLON.PhysicsImpostor(trackMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: def.track.mass,
            friction: def.track.friction,
            restitution: def.track.restitution
        }, scene);

        var leftSinkMesh = BABYLON.MeshBuilder.CreateBox('left-sink', {
            width: def.sink.width,
            height: def.sink.height,
            depth: def.sink.depth
        }, scene);
        leftSinkMesh.material = plasticMaterial;
        leftSinkMesh.position = new BABYLON.Vector3(def.sink.width / 2 + def.track.width / 2, 0, def.sink.depth / 2);
        leftSinkMesh.impostor = new BABYLON.PhysicsImpostor(leftSinkMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: def.sink.mass,
            friction: def.sink.friction,
            restitution: def.sink.restitution
        }, scene);


        var leftSinkWallMesh = BABYLON.MeshBuilder.CreateBox('left-sink-wall', {
            width: def.sinkWall.width,
            height: def.sinkWall.height,
            depth: def.sinkWall.depth
        }, scene);
        leftSinkWallMesh.material = woodMaterial;
        leftSinkWallMesh.position = new BABYLON.Vector3(def.sink.width + def.track.width / 2 + def.sinkWall.width / 2, 0, def.sink.depth / 2);
        leftSinkWallMesh.impostor = new BABYLON.PhysicsImpostor(leftSinkWallMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: def.sinkWall.mass,
            friction: def.sinkWall.friction,
            restitution: def.sinkWall.restitution
        }, scene);

        var rightSinkMesh = BABYLON.MeshBuilder.CreateBox('right-sink', {
            width: def.sink.width,
            height: def.sink.height,
            depth: def.sink.depth
        }, scene);
        rightSinkMesh.material = plasticMaterial;
        rightSinkMesh.position = new BABYLON.Vector3(-1 * (def.sink.width / 2 + def.track.width / 2), 0, def.sink.depth / 2);
        rightSinkMesh.impostor = new BABYLON.PhysicsImpostor(rightSinkMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: def.sink.mass,
            friction: def.sink.friction,
            restitution: def.sink.restitution
        }, scene);

        var rightSinkWallMesh = BABYLON.MeshBuilder.CreateBox('right-sink-wall', {
            width: def.sinkWall.width,
            height: def.sinkWall.height,
            depth: def.sinkWall.depth
        }, scene);
        rightSinkWallMesh.material = woodMaterial;
        rightSinkWallMesh.position = new BABYLON.Vector3(-1 * (def.sink.width + def.track.width / 2 + def.sinkWall.width / 2), 0, def.sink.depth / 2);
        rightSinkWallMesh.impostor = new BABYLON.PhysicsImpostor(rightSinkWallMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: def.sinkWall.mass,
            friction: def.sinkWall.friction,
            restitution: def.sinkWall.restitution
        }, scene);
    }

    return {
        addTrackToScene: addTrackToScene
    }
}());