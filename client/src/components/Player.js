import { ConeGeometry, Mesh, MeshBasicMaterial } from "three";

export default class Player {
    constructor(scene) {
        this.scene = scene;
        const geometry = new ConeGeometry(5, 20);
        const material = new MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        })
        this.obj = new Mesh(geometry, material);
        this.obj.position.set(500, 26, 500);
        this.scene.add(this.obj);
    }
}