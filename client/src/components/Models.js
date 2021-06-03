import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import playerModel from "../assets/models/player.fbx";
import enemyModel from "../assets/models/enemy.fbx"

const loadings = [];

const models = {
    player: {
        path: playerModel,
        mesh: null
    },

    enemy: {
        path: enemyModel,
        mesh: null
    }
}

export async function loadModels() {
    const loader = new FBXLoader();
    for (let key in models) {
        loadings.push(new Promise(resolve => {
            loader.load(models[key].path, fbx => {
                models[key].mesh = fbx;
                resolve();
            });
        }));
    }

    await Promise.all(loadings);
}

export default function getModel(name) {
    return models[name].mesh;
}