import { LoopOnce } from "three";
import StateMachine from "./StateMachine";
import { State } from "./StateMachine";

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

    update() {
        if (this.parent.target.obj) {
            if (this.parent.mesh.position.distanceTo(this.parent.target.obj.position) < 20) {
                this.parent.setState('enemyAttack');
            }
        }
    }

}

class EnemyAttackState extends State {
    constructor(parent) {
        super(parent)

        this.finishedCallback = () => {
            this.finished();
        }

        this.attacks = [
            'middleKick',
            'sideKick',
            'kneeKick',
            'hook',
            'leftJab',
            'rightJab'
        ]
    }

    enter(prevState) {
        const attackName = this.attacks[Math.floor(Math.random() * this.attacks.length)];
        const enemyAttack = this.parent.animations.anims[attackName].action;
        this.name = attackName;
        this.mixer = enemyAttack.getMixer();
        this.mixer.addEventListener('finished', this.finishedCallback);

        if (prevState) {
            const prevAction = this.parent.animations.anims[prevState.name].action;

            enemyAttack.reset();
            enemyAttack.setLoop(LoopOnce, 1);
            enemyAttack.clampWhenFinished = true;
            if (this.name != prevState.name) {
                enemyAttack.crossFadeFrom(prevAction, 0.2, true);
            }
            enemyAttack.play();
        } else {
            enemyAttack.play();
        }
    }

    update() {
        if (this.parent.target.obj) {
            this.parent.mesh.lookAt(this.parent.target.obj.position);

            if (this.parent.mesh.position.distanceTo(this.parent.target.obj.position) > 20) {
                this.parent.setState('enemyIdle');
            }
        }
    }

    finished() {
        this.mixer.removeEventListener('finished', this.finishedCallback);
        this.parent.setState('enemyAttack');
    }
}

export default class EnemyStateMachine extends StateMachine{
    constructor(animations, target, mesh) {
        super();
        this.animations = animations;
        this.target = target;
        this.mesh = mesh
        
        this.addState('enemyIdle', EnemyIdleState);
        this.addState('enemyAttack', EnemyAttackState);
    }
}