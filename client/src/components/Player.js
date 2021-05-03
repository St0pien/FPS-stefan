import CharacterController from "./CharacterController";


export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.character = new CharacterController({ scene: this.scene });
    }

    update(time) {
        this.character.update(time);
    }
}