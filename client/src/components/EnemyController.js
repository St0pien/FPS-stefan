import { CharacterControllerAnimations } from "./CharacterController";
import { AnimationMixer, LoadingManager } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import EnemyStateMachine from "./EnemyStateMachine";


import fbxModel from "../assets/models/enemy.fbx"
import enemyIdle from "../assets/animations/enemyidle.fbx";

export default class EnemyController {
    constructor(params) {
        this.params = params;

        this.animations = {};
        this.stateMachine = new EnemyStateMachine(new CharacterControllerAnimations(this.animations));

        this.loadModels();
    }

    loadModels() {
        const loader = new FBXLoader();
        loader.load(fbxModel, fbx => {
            fbx.scale.setScalar(0.1);
            const { position } = this.params;
            fbx.position.set(position.x, position.y, position.z);
            fbx.traverse(c => {
                if (c.isMesh) {
                    c.castShadow = true;
                }
            });

            this.obj = fbx;
            this.params.scene.add(this.obj);
            
            this.mixer = new AnimationMixer(this.obj);

            const loadCallback = (name, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[name] = {
                    clip: clip,
                    action: action
                }
                this.stateMachine.setState('enemyIdle')
            }

            const loader = new FBXLoader(this.manager);
            loader.load(enemyIdle, (a) => loadCallback('enemyIdle', a));
        });
    }

    update(timeElapsed) {
        if (!this.obj) return;

        this.stateMachine.update(timeElapsed);

        if (this.mixer) {
            this.mixer.update(timeElapsed);
        }
    }
}