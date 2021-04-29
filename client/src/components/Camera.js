import { PerspectiveCamera, Vector3 } from 'three';
import GUI from "./GUI";

export default class Camera {
    constructor(renderer, player) {
        this.player = player

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
        const cameraDist = parseFloat(GUI.options['camera-dist'].value)
        const cameraY = parseFloat(GUI.options['camera-y'].value);
        const offset = new Vector3(cameraDist, cameraY, 0);
        offset.add(this.player.position);
        this.threeCamera.position.set(offset.x, offset.y, offset.z);

        const target = new Vector3(0, parseFloat(GUI.options['camera-vertical'].value), parseFloat(GUI.options['camera-horizontal'].value));
        target.add(this.player.position);
        this.threeCamera.lookAt(target);

        this.threeCamera.fov = parseFloat(GUI.options['camera-fov'].value);
        this.threeCamera.updateProjectionMatrix();

        if (GUI.options['camera-top'].checked) {
            this.threeCamera.position.y += 800;
            this.threeCamera.lookAt(this.player.position)
        }
    }
}