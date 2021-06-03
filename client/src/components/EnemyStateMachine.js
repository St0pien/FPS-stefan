import StateMachine from "./StateMachine";
import { State } from "./StateMachine";
import EnemyFire from "./EnemyFire";
import { LoopOnce, Vector3 } from "three";

class EnemyIdleState extends State {
    constructor(parent) {
        super(parent);

        this.name = 'enemyIdle';
    }

    enter(prevState) {
        const enemyIdleAction = this.parent.animations.anims['enemyIdle'].action;
        if (prevState) {
            const prevAction = this.parent.animations.anims[prevState.name].action;

            const ratio = enemyIdleAction.getClip().duration / prevAction.getClip().duration;
            enemyIdleAction.time = prevAction.time * ratio;
            enemyIdleAction.enabled = true;
            enemyIdleAction.setEffectiveTimeScale(1);
            enemyIdleAction.setEffectiveWeight(1);
            enemyIdleAction.crossFadeFrom(prevAction, 0.5, true);
            enemyIdleAction.play();
        } else {
            enemyIdleAction.play();
        }
    }

    update(timeElapsed) {
        this.parent.fire.update(timeElapsed)
        if (this.parent.target.obj) {
            if (this.parent.mesh.position.distanceTo(this.parent.target.obj.position) < 40) {
                this.parent.setState('enemyAttack');
            }
        }
    }

}

class EnemyAttackState extends State {
    constructor(parent) {
        super(parent)

        this.name = "enemyAttack";
    }

    enter(prevState) {
        const enemyAttack = this.parent.animations.anims['enemyAttack'].action;

        if (prevState) {
            const prevAction = this.parent.animations.anims[prevState.name].action;

            enemyAttack.time = 0;
            enemyAttack.enabled = true;
            enemyAttack.setEffectiveTimeScale(1);
            enemyAttack.setEffectiveWeight(1);
            enemyAttack.crossFadeFrom(prevAction, 0.2, true);
            enemyAttack.play();
        } else {
            enemyAttack.play();
        }
    }

    update(timeElapsed) {
        const enemyAttack = this.parent.animations.anims['enemyAttack'].action;
        const progress = enemyAttack.time / enemyAttack.getClip().duration;


        const offset = new Vector3(0, 100, 120);
        offset.applyMatrix4(this.parent.mesh.matrixWorld);
        this.parent.fire.points.position.copy(offset);

        if (progress > 0.3 && progress < 0.8) {
            this.parent.fire.addParticles(timeElapsed);

            if (this.parent.target.obj) {
                this.parent.target.onHit();
            }
        }
        this.parent.fire.update(timeElapsed)

        if (this.parent.target.obj) {
            this.parent.mesh.lookAt(this.parent.target.obj.position);            

            if (this.parent.mesh.position.distanceTo(this.parent.target.obj.position) > 40) {
                this.parent.setState('enemyIdle');
            }
        }
    }
}

class EnemyDeathState extends State {
    constructor(parent) {
        super(parent);

        this.name = "enemyDeath"
    }

    enter(prevState) {
        const enemyDeath = this.parent.animations.anims['enemyDeath'].action;

        if (prevState) {
            const prevAction = this.parent.animations.anims[prevState.name].action;

            enemyDeath.reset();
            enemyDeath.setLoop(LoopOnce, 1);
            enemyDeath.clampWhenFinished = true;
            enemyDeath.crossFadeFrom(prevAction, 0.2, true);
            enemyDeath.play();
        } else {
            enemyDeath.play();
        }
    }

    update(timeElapsed) {
        this.parent.fire.update(timeElapsed);
    }
}

export default class EnemyStateMachine extends StateMachine{
    constructor(animations, scene, target, mesh, camera) {
        super();
        this.animations = animations;
        this.target = target;
        this.mesh = mesh;
        this.camera = camera;
        this.fire = new EnemyFire({
            scene,
            parent: this.mesh,
            camera: this.camera
        });
        
        this.addState('enemyIdle', EnemyIdleState);
        this.addState('enemyAttack', EnemyAttackState);
        this.addState('enemyDeath', EnemyDeathState);
    }
}