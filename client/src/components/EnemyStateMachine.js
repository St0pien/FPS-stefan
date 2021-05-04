import StateMachine from "./StateMachine";
import { State } from "./StateMachine";

class EnemyIdleState extends State {
    constructor(parent) {
        super(parent);

        this.name = 'screaming';
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
}

export default class EnemyStateMachine extends StateMachine{
    constructor(animations) {
        super();
        this.animations = animations;
        
        this.addState('enemyIdle', EnemyIdleState);
    }
}