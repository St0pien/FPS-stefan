export class State {
    constructor(parent) {
        this.parent = parent;
    }

    enter() {}
    exit() {}
    update() {}
}

export default class StateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
    }

    addState(name, type) {
        this.states[name] = type;
    }

    setState(name) {
        const prevState = this.currentState;

        if (prevState) {
            if (prevState.name == name) {
                return;
            }
            prevState.exit();
        }

        const state = new this.states[name](this);

        this.currentState = state;
        state.enter(prevState);
    }

    update(timeElapsed, input) {
        if (this.currentState) {
            this.currentState.update(timeElapsed, input);
        }
    }
}
