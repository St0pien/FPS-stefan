import { CharacterControllerAnimations } from "./CharacterController";
import { AnimationMixer, BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import EnemyStateMachine from "./EnemyStateMachine";
import getModel from "./Models";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

import getAnimation from "./Animations";
import Stats from './Stats';


export default class EnemyController {
    constructor(params) {
        this.params = params;

        this.animations = {};

        this.loadModels();

        this.index = params.index;
        this.life = 100;
        Stats.addEnemy();
        Stats.updateEnemy(this.index, this.life);
    }

    loadModels() {
        const fbx = SkeletonUtils.clone(getModel('enemy'));
        fbx.scale.setScalar(0.1);
        const { position } = this.params;
        fbx.position.set(position.x, position.y, position.z);
        fbx.traverse(c => {
            if (c.isMesh) {
                c.castShadow = true;
            }
        });

        this.obj = fbx;
        this.stateMachine = new EnemyStateMachine(new CharacterControllerAnimations(this.animations), this.params.scene, this.params.target, this.obj, this.params.camera);
        this.params.scene.add(this.obj);
        const collisionHelper = new Mesh(new BoxGeometry(7, 18, 7), new MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
        this.params.scene.add(collisionHelper);
        collisionHelper.position.set(position.x, position.y + 9.5, position.z);
        collisionHelper.visible = false;

        this.mixer = new AnimationMixer(this.obj);

        const addAnimation = (name, anim) => {
            const clip = anim;
            const action = this.mixer.clipAction(clip);

            this.animations[name] = {
                clip: clip,
                action: action
            }

            if (this.animations.enemyIdle) {
                this.stateMachine.setState('enemyIdle')
            }
        }

        const enemyIdle = getAnimation('enemyIdle').clone();
        const enemyAttack = getAnimation('enemyAttack').clone();
        const enemyDeath = getAnimation('enemyDeath').clone();

        addAnimation('enemyIdle', enemyIdle);
        addAnimation('enemyAttack', enemyAttack);
        addAnimation('enemyDeath', enemyDeath);
        this.stateMachine.setState('enemyIdle');

        collisionHelper.onHit = () => {
            this.life -= 20;
            Stats.updateEnemy(this.index, this.life);
            if (this.life <= 0) {
                this.stateMachine.setState('enemyDeath');
                this.params.scene.remove(collisionHelper);
            }
        }
    }

    update(timeElapsed) {
        if (!this.obj) return;

        this.stateMachine.update(timeElapsed);

        if (this.mixer) {
            this.mixer.update(timeElapsed);
        }
    }
}