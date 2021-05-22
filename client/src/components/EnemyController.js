import { CharacterControllerAnimations } from "./CharacterController";
import { AnimationMixer, BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import EnemyStateMachine from "./EnemyStateMachine";


import fbxModel from "../assets/models/enemy.fbx"
import enemyIdle from "../assets/animations/enemyidle.fbx";
import middleKick from "../assets/animations/middlekick.fbx";
import sideKick from "../assets/animations/sidekick.fbx";
import kneeKick from "../assets/animations/kneekick.fbx"
import hook from "../assets/animations/hook.fbx"
import leftJab from "../assets/animations/leftjab.fbx"
import rightJab from "../assets/animations/rightjab.fbx"

export default class EnemyController {
    constructor(params) {
        this.params = params;

        this.animations = {};        

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
            this.stateMachine = new EnemyStateMachine(new CharacterControllerAnimations(this.animations), this.params.target, this.obj);
            this.params.scene.add(this.obj);
            const collisionHelper = new Mesh(new BoxGeometry(5, 18, 5), new MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
            this.params.scene.add(collisionHelper);
            collisionHelper.position.set(position.x, position.y + 9.5, position.z);
            collisionHelper.visible = false;
            
            this.mixer = new AnimationMixer(this.obj);

            const loadCallback = (name, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[name] = {
                    clip: clip,
                    action: action
                }

                if(this.animations.enemyIdle) {
                    this.stateMachine.setState('enemyIdle')
                }
            }

            const loader = new FBXLoader(this.manager);
            loader.load(middleKick, (a) => loadCallback('middleKick', a));
            loader.load(enemyIdle, (a) => loadCallback('enemyIdle', a));
            loader.load(sideKick, (a) => loadCallback('sideKick', a));
            loader.load(kneeKick, (a) => loadCallback('kneeKick', a));
            loader.load(hook, (a) => loadCallback('hook', a));
            loader.load(leftJab, (a) => loadCallback('leftJab', a));
            loader.load(rightJab, (a) => loadCallback('rightJab', a));
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