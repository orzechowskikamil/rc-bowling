window.rcBowling.lights = (function () {
    var shadowGenerator;

    function addToRenderShadowList(mesh) {
        shadowGenerator.getShadowMap().renderList.push(mesh);
    }

    function initLights(scene) {
        var lightPosition = new BABYLON.Vector3(-2, 10, -4);
        var lightDirection = new BABYLON.Vector3(0, -1, 0.5);
        var lightGradient = 2;
        var lightAngleRad = 1.6;
        var light = new BABYLON.SpotLight("light", lightPosition, lightDirection, lightAngleRad, lightGradient, scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 1, 1);

        shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurVarianceShadowMap = true;
    }


    return {
        addToRenderShadowList: addToRenderShadowList,
        initLights: initLights
    };
}());