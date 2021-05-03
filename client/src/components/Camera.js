import { PerspectiveCamera, Vector3 } from 'three';
import GUI from "./GUI";

export default class Camera {
    constructor(renderer, player) {
        this.target = player.character;

        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        this.threeCamera = new PerspectiveCamera(75, width / height, 0.1, 10000);
        this.updateSize(renderer);

        window.addEventListener('resize', () => this.updateSize(renderer));
    }

    updateSize(renderer) {
        this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
        this.threeCamera.updateProjectionMatrix();
    }

    update() {
        if (this.target.obj) {
            const offset = new Vector3(0, 150, -200);
            
            const campPos = offset.applyMatrix4(this.target.obj.matrixWorld);
            this.threeCamera.position.set(campPos.x, campPos.y, campPos.z);

            const lookat = new Vector3(0, 10, 0);
            lookat.add(this.target.obj.position);
            this.threeCamera.lookAt(lookat);
        }
    }
}