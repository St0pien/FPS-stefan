import { MeshStandardMaterial, RepeatWrapping, TextureLoader, Vector2 } from "three"
import concreteDiffuse from "../assets/textures/concrete/concrete_diffuse.jpg";
import concreteNormal from "../assets/textures/concrete/concrete_normal.jpg";
import concreteHeight from "../assets/textures/concrete/concrete_height.jpg";
import concreteRoughness from "../assets/textures/concrete/concrete_roughness.jpg";
import concreteAo from "../assets/textures/concrete/concrete_ao.jpg";

import rockDiffuse from "../assets/textures/rock/rock_diffuse.jpg";
import rockNormal from "../assets/textures/rock/rock_normal.jpg";
import rockHeight from "../assets/textures/rock/rock_height.jpg";
import rockRoughness from "../assets/textures/rock/rock_roughness.jpg";
import rockAo from "../assets/textures/rock/rock_ao.jpg";

import concretemossDiffuse from "../assets/textures/concretemoss/concretemoss_diffuse.jpg";
import concretemossNormal from "../assets/textures/concretemoss/concretemoss_normal.jpg";
import concretemossHeight from "../assets/textures/concretemoss/concretemoss_height.jpg";
import concretemossRoughness from "../assets/textures/concretemoss/concretemoss_roughness.jpg";
import concretemossAo from "../assets/textures/concretemoss/concretemoss_ao.jpg";


const availableTextures = {
    concreteDiffuse,
    concreteNormal,
    concreteHeight,
    concreteRoughness,
    concreteAo,

    rockDiffuse,
    rockNormal,
    rockHeight,
    rockRoughness,
    rockAo,

    concretemossDiffuse,
    concretemossNormal,
    concretemossHeight,
    concretemossRoughness,
    concretemossAo
}

function loadMaterial(materialName, scale=[1, 1]) {
    const textures = {
        diffuse: null,
        normal: null,
        height: null,
        roughness: null,
        ao: null,
    }

    const textureLoader = new TextureLoader();

    for (let t in textures) {
        const textureName = `${materialName}${t[0].toUpperCase() + t.slice(1)}`;
        if (availableTextures[textureName]) {
            textures[t] = textureLoader.load(availableTextures[textureName]);
            const [x, y] = scale;
            textures[t].repeat.set(x, y);
            textures[t].wrapS = RepeatWrapping;
            textures[t].wrapT = RepeatWrapping;
        }
    }

    return new MeshStandardMaterial({
        map: textures.diffuse,
        normalMap: textures.normal,
        displacementMap: textures.height,
        roughnessMap: textures.roughness,
        roughness: 1.5,
        aoMap: textures.ao,
    });
}

export const floorMaterial = loadMaterial('concrete', [5, 5]);
export const wallMaterial = loadMaterial('rock');
wallMaterial.displacementBias = -0.7;
export const ceilingMaterial = loadMaterial('concretemoss', [8, 8]);
