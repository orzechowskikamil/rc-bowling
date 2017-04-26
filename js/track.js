window.rcBowling.track = (function () {

    var def = window.rcBowling.definitions;

    var plasticMaterial;
    var woodMaterial;


    function loadMaterials(scene) {
        let woodTexture = new BABYLON.Texture('assets/wood.jpg', scene);
        woodTexture.uScale = 5;
        woodTexture.vScale = 1;
        woodMaterial = new BABYLON.StandardMaterial('wood-material', scene);
        woodMaterial.diffuseTexture = woodTexture;
        plasticMaterial = new BABYLON.StandardMaterial('plastic-material', scene);
        plasticMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    }


    function addSinkToScene(name, positionVector, scene) {
        let width = def.sink.width;
        let height = 0.01;
        let depth = def.sink.depth;
        let maxAngle = Math.PI * 0.2;
        let maxX = width * 0.35;
        let maxY = height * 1.3;


        let sinkLayers = [
            {x: -1 * maxX, y: maxY, angle: -1 * maxAngle},
            {x: -0.7 * maxX, y: maxY * 0.5, angle: -0.7 * maxAngle},
            {x: -0.3 * maxX, y: maxY * 0.2, angle: -0.4 * maxAngle},
            {x: 0.3 * maxX, y: maxY * 0.2, angle: 0.4 * maxAngle},
            {x: 0.7 * maxX, y: maxY * 0.5, angle: 0.7 * maxAngle},
            {x: maxX, y: maxY, angle: maxAngle}
        ];
        sinkLayers.forEach((val, i) => {
            let sinkWallMesh = BABYLON.MeshBuilder.CreateBox(`${name}-${i}`, {
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

    function addFloorToScene(name, width, depth, position, u, v, physics, scene) {
        let trackMesh = BABYLON.MeshBuilder.CreateBox(name, {
            width: width,
            height: def.floor.height,
            depth: depth,
        }, scene);
        trackMesh.position = position;
        trackMesh.receiveShadows = true;
        trackMesh.material = woodMaterial.clone(`floor-${name}-material`);
        trackMesh.material.diffuseTexture.uScale = u;
        trackMesh.material.diffuseTexture.vScale = v;
        if (physics) {
            trackMesh.impostor = new BABYLON.PhysicsImpostor(trackMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: def.floor.mass,
                friction: def.floor.friction,
                restitution: def.floor.restitution
            }, scene);
        }
    }

    function addTrackToScene(scene) {
        loadMaterials(scene);
        [
            {name: 'track', def: def.floor.track},
            {name: 'front', def: def.floor.front},
            {name: 'left', def: def.floor.left},
            {name: 'right', def: def.floor.right}
        ].forEach((val, i, arr)=> {
            addFloorToScene(`floor-${val.name}`, val.def.width, val.def.depth, val.def.position, val.def.u, val.def.v, val.def.physics, scene);
        });

        addSinkToScene('left-sink', def.sink.leftSinkPosition, scene);
        addSinkToScene('right-sink', def.sink.rightSinkPosition, scene);
    }

    return {
        addTrackToScene: addTrackToScene
    }
}());