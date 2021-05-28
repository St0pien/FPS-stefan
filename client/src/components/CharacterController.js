import CharacterControllerInput from "./CharacterControllerInput";
import CharacterStateMachine from "./CharacterStateMachine";
import Collider from "./Collider";
import PlayerFire from './PlayerFire';
import { AnimationMixer, LoadingManager, Quaternion, Vector3, MathUtils, Euler } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import fbxModel from "../assets/models/player.fbx";
import runningAnim from "../assets/animations/running.fbx";
import idleAnim from "../assets/animations/idle.fbx";

export class CharacterControllerAnimations {
    constructor(animations) {
        this.anims = animations;
    }
}

export default class CharacterController {
    constructor(params) {
        this.params = params;

        this.decceleration = new Vector3(-0.0005, -0.0001, -7);
        this.acceleration = new Vector3(1, 0.25, 350);
        this.velocity = new Vector3(0, 0, 0);

        this.animations = {};
        this.input = new CharacterControllerInput();
        this.stateMachine = new CharacterStateMachine(new CharacterControllerAnimations(this.animations));
        this.rightArmAngle = new Euler();
        this.camera = null;

        this.loadModels();
    }

    loadModels() {
        const loader = new FBXLoader();
        loader.load(fbxModel, fbx => {
            fbx.scale.setScalar(0.09);
            fbx.position.set(600, 2, 700);
            fbx.traverse(c => {
                c.castShadow = true;
            });

            this.obj = fbx;
            this.collider = new Collider(this.obj, this.params.scene.children, 7);
            this.params.scene.add(this.obj);
            this.obj.traverse(c => {
                if (c.name == 'mixamorigRightArm') {
                    this.rightArm = c;
                }
            });
            
            this.mixer = new AnimationMixer(this.obj);

            this.fire = new PlayerFire({
                scene: this.params.scene,
                parent: this.obj,
                camera: this.camera
            });
            
            this.manager = new LoadingManager();
            this.manager.onLoad = () => {
                this.stateMachine.setState('idle');
            }

            const loadCallback = (name, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[name] = {
                    clip: clip,
                    action: action
                }
            }

            const loader = new FBXLoader(this.manager);
            loader.load(runningAnim, (a) => loadCallback('running', a));
            loader.load(idleAnim, (a) => loadCallback('idle', a));
        });
    }

    update(timeElapsed) {
        if (!this.obj) return;

        this.collider.update();

        this.stateMachine.update(timeElapsed, this.input);

        const velocity = this.velocity;
        const frameDecceleration = new Vector3(
            velocity.x * this.decceleration.x,
            velocity.y * this.decceleration.y,
            velocity.z * this.decceleration.z
        );
        frameDecceleration.multiplyScalar(timeElapsed);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

        velocity.add(frameDecceleration);

        const controlObject = this.obj;
        const Q = new Quaternion();
        const A = new Vector3();
        const R = controlObject.quaternion.clone();

        if (this.input.keys.forward) {
            velocity.z += this.acceleration.z * timeElapsed;
        }

        if (this.input.keys.backward) {
            velocity.z -= this.acceleration.z * timeElapsed;
        }

        if (this.input.keys.left) {
            A.set(0, 1, 0);
            Q.setFromAxisAngle(A, 4 * Math.PI * timeElapsed * this.acceleration.y);
            R.multiply(Q);
        }

        if (this.input.keys.right) {
            A.set(0, 1, 0);
            Q.setFromAxisAngle(A, 4 * -Math.PI * timeElapsed * this.acceleration.y);
            R.multiply(Q);
        }

        controlObject.quaternion.copy(R);

        const oldPosition = new Vector3();
        oldPosition.copy(controlObject.position);

        const forward = new Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * timeElapsed);
        forward.multiplyScalar(velocity.z * timeElapsed);

        const collisionOffset = new Vector3(1, 1, 1);
        this.collider.activeCollisions.forEach(collision => {
            const dir = new Vector3();
            dir.subVectors(collision.object.position, controlObject.position);

            const futurePosition = controlObject.position.clone();
            futurePosition.add(forward);
            futurePosition.add(sideways);

            if (Math.abs(dir.x) > Math.abs(dir.z)) {
                if (Math.abs(futurePosition.x - collision.object.position.x) < Math.abs(controlObject.position.x - collision.object.position.x)) {
                    collisionOffset.x = 0;
                }
            } else {
                if (Math.abs(futurePosition.z - collision.object.position.z) < Math.abs(controlObject.position.z - collision.object.position.z)) {
                    collisionOffset.z = 0;
                }
            }
            
        });

        forward.multiply(collisionOffset);
        sideways.multiply(collisionOffset);

        controlObject.position.add(forward);
        controlObject.position.add(sideways);

        oldPosition.copy(controlObject.position);

        if (this.mixer) {
            this.mixer.update(timeElapsed)
        }

        if (this.input.keys.attack) {
            this.rightArmAngle.z = MathUtils.lerp(this.rightArmAngle.z, -Math.PI/2.5, timeElapsed*10);
        } else if (this.rightArmAngle.z < 0) {
            this.rightArmAngle.z += Math.sin(timeElapsed)*5;
        }

        this.rightArm.rotateZ(this.rightArmAngle.z);

        const offset = new Vector3(-40, 100, 50);
        offset.applyMatrix4(this.obj.matrixWorld);
        this.fire.points.position.copy(offset);

        if (this.input.keys.attack) {
            this.fire.addParticles(timeElapsed);
        }
        this.fire.update(timeElapsed);
    }
}