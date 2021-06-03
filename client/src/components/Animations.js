import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import runningAnim from "../assets/animations/running.fbx";
import idleAnim from "../assets/animations/idle.fbx";

import enemyIdleAnim from "../assets/animations/enemyidle.fbx";
import enemyAttackAnim from "../assets/animations/enemyattack.fbx";
import enemyDeathAnim from "../assets/animations/enemyDeath.fbx";

const loadings = [];

const models = {
    running: {
        path: runningAnim,
        animation: null,
    },

    idle: {
        path: idleAnim,
        animation: null,
    },

    enemyIdle: {
        path: enemyIdleAnim,
        animation: null,
    },

    enemyAttack: {
        path: enemyAttackAnim,
        animation: null,
    },

    enemyDeath: {
        path: enemyDeathAnim,
        animation: null
    }
}

export async function loadAnimations() {
    const loader = new FBXLoader();
    for (let key in models) {
        loadings.push(new Promise(resolve => {
            loader.load(models[key].path, fbx => {
                models[key].animation = fbx.animations[0];
                resolve();
            });
        }));
    }

    await Promise.all(loadings);
}

export default function getAnimation(name) {
    return models[name].animation;
}