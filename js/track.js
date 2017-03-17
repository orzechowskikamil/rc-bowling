window.rcBowling.track = (function () {

    var def = window.rcBowling.definitions;

    var plasticMaterial;
    var woodMaterial;


    function loadMaterials(scene) {
        var woodTexture = new BABYLON.Texture('assets/wood.jpg', scene);
        woodTexture.uScale = 5;
        woodTexture.vScale = 1;
        woodMaterial = new BABYLON.StandardMaterial('wood-material', scene);
        woodMaterial.diffuseTexture = woodTexture;

     //   var plasticTexture = new BABYLON.Texture('assets/plastic.jpg', scene);
    //    plasticTexture.uScale = 25;
     //   plasticTexture.vScale = 1;
        plasticMaterial = new BABYLON.StandardMaterial('plastic-material', scene);
        plasticMaterial.diffuseColor=new BABYLON.Color3(0.2,0.2,0.2);
    }


    function addSinkToScene(name, positionVector, scene) {
        var width = def.sink.width;
        var height = 0.01;
        var depth = def.sink.depth;
        var maxAngle = Math.PI * 0.2;
        var maxX = width * 0.35;
        var maxY = height * 1.3;

        [{x: -1 * maxX, y: maxY, angle: -1 * maxAngle},
            {x: -0.7 * maxX, y: maxY * 0.5, angle: -0.7 * maxAngle},
            {x: -0.3 * maxX, y: maxY * 0.2, angle: -0.4 * maxAngle},
            {x: 0.3 * maxX, y: maxY * 0.2, angle: 0.4 * maxAngle},
            {x: 0.7 * maxX, y: maxY * 0.5, angle: 0.7 * maxAngle},
            {x: maxX, y: maxY, angle: maxAngle}
        ].forEach(function (val, i) {
            var sinkWallMesh = BABYLON.MeshBuilder.CreateBox(name + '-' + i, {
                width: width / 3,
                height: height,
                depth: depth
            }, scene);
            sinkWallMesh.material = plasticMaterial;
            sinkWallMesh.position = positionVector.add(new BABYLON.Vector3(val.x, val.y, 0));
            sinkWallMesh.rotation = new BABYLON.Vector3(0, 0, val.angle);
            sinkWallMesh.impostor = new BABYLON.PhysicsImpostor(sinkWallMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: def.sink.mass,
                friction: def.sink.friction,
                restitution: def.sink.restitution
            }, scene);
        });
    }

    function addFloorToScene(name, width, depth, position, u, v, scene) {
        var trackMesh = BABYLON.MeshBuilder.CreateBox(name, {
            width: width,
            height: def.floor.height,
            depth: depth,
        }, scene);
        trackMesh.position = position;
        trackMesh.receiveShadows = true;
        trackMesh.material = woodMaterial.clone('floor-' + name + '-material');  debugger
        trackMesh.material.diffuseTexture.uScale = u;
        trackMesh.material.diffuseTexture.vScale = v;
        trackMesh.impostor = new BABYLON.PhysicsImpostor(trackMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: def.floor.mass,
            friction: def.floor.friction,
            restitution: def.floor.restitution
        }, scene);
    }

    function addTrackToScene(scene) {
        loadMaterials(scene);

        [
            {name: 'track', def: def.floor.track},
            {name: 'front', def: def.floor.front},
            {name: 'left', def: def.floor.left},
            {name: 'right', def: def.floor.right}
        ].forEach(function (val, i, arr) {
            addFloorToScene('floor-' + val.name, val.def.width, val.def.depth, val.def.position, val.def.u, val.def.v, scene);
        });


        addSinkToScene('left-sink', def.sink.leftSinkPosition, scene);
        addSinkToScene('right-sink', def.sink.rightSinkPosition, scene);

    }

    return {
        addTrackToScene: addTrackToScene
    }
}());