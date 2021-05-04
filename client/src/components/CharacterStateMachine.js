import StateMachine from "./StateMachine";
import { State } from "./StateMachine";

class IdleState extends State {
    constructor(parent) {
        super(parent);

        this.name = 'idle';
    }

    enter(prevState) {
        const idleAction = this.parent.animations.anims['idle'].action;
        if (prevState) {
            const prevAction = this.parent.animations.anims[prevState.name].action;

            const ratio = idleAction.getClip().duration / prevAction.getClip().duration;
            idleAction.time = prevAction.time * ratio;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1);
            idleAction.setEffectiveWeight(1);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    update(_, input) {
        if (input.keys.forward || input.keys.backward) {
            this.parent.setState('running');
        }
    }
}

class RunningState extends State {
    constructor(parent) {
        super(parent);

        this.name = 'running';
    }

    enter(prevState) {
        const runningAction = this.parent.animations.anims['running'].action;
        if (prevState) {
            const prevAction = this.parent.animations.anims[prevState.name].action;

            runningAction.enabled = true;
            const ratio = runningAction.getClip().duration / prevAction.getClip().duration;
            runningAction.time = prevAction.time * ratio;
            runningAction.setEffectiveTimeScale(1);
            runningAction.setEffectiveWeight(1);
            runningAction.crossFadeFrom(prevAction, 0.5, true);
            runningAction.play();
        }
    }

    update(_, input) {
        if (!input.keys.forward && !input.keys.backward) {
            this.parent.setState('idle');
        }
    }
}

export default class CharacterStateMachine extends StateMachine{
    constructor(animations) {
        super();
        this.animations = animations;
        
        this.addState('idle', IdleState);
        this.addState('running', RunningState);
    }
}