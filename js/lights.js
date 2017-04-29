window.rcBowling.lights = (function () {
    var shadowGenerators=[];

    function addToRenderShadowList(mesh) {
        for (let shadowGenerator of shadowGenerators) {
            shadowGenerator.getShadowMap().renderList.push(mesh);
        }
    }

    function initLights(scene) {
        function addMainLight() {
            let lightPosition = new BABYLON.Vector3(0, 2, 0);
            let lightDirection = new BABYLON.Vector3(0, -1, 0.6);
            let lightGradient = 1;
            let lightAngleRad = 10;
            let light = new BABYLON.SpotLight("light", lightPosition, lightDirection, lightAngleRad, lightGradient, scene);
            light.diffuse = new BABYLON.Color3(1, 0.8, 1);
            light.specular = new BABYLON.Color3(1, 0.8, 1);

            let shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light);
            shadowGenerator2.useBlurVarianceShadowMap = true;
            shadowGenerators.push(shadowGenerator2)
        }

        function addInsideLight() {
            var light0 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(-1, 1, 18), new BABYLON.Vector3(1, -1,0), 3, 3, scene);
            light0.diffuse = new BABYLON.Color3(1, 0, 0);
            light0.specular = new BABYLON.Color3(1, 0, 0);

            var light1 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(1, 1, 18), new BABYLON.Vector3(-1, -1, 0), 3, 3, scene);
            light1.diffuse = new BABYLON.Color3(0, 0, 1);
            light1.specular = new BABYLON.Color3(0, 0, 1);

            let shadowGenerator0 = new BABYLON.ShadowGenerator(1024, light0);
            shadowGenerator0.useBlurVarianceShadowMap = true;
            shadowGenerators.push(shadowGenerator0)

            let shadowGenerator1 = new BABYLON.ShadowGenerator(1024, light1);
            shadowGenerator1.useBlurVarianceShadowMap = true;
            shadowGenerators.push(shadowGenerator1)
        }

        addMainLight();
        addInsideLight();
    }


    return {
        addToRenderShadowList: addToRenderShadowList,
        initLights: initLights
    };
}());