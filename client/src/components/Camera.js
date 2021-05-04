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
        const options = GUI.getOptions();

        if (options['camera-top']) {
            this.threeCamera.position.set(500, 800, 500);
            this.threeCamera.lookAt(new Vector3(500, 0, 500));
            return;
        }

        if (this.target.obj) {
            const offset = new Vector3(0, options['camera-y'], options['camera-dist']);
            
            const campPos = offset.applyMatrix4(this.target.obj.matrixWorld);
            this.threeCamera.position.set(campPos.x, campPos.y, campPos.z);

            const lookat = new Vector3(0, 10, 0);
            lookat.add(new Vector3(options['camera-horizontal'], options['camera-vertical'], 0));
            lookat.applyMatrix4(this.target.obj.matrixWorld);
            this.threeCamera.lookAt(lookat);
        }

        this.threeCamera.fov = options['camera-fov'];
        this.threeCamera.updateProjectionMatrix();
    }
}