import { Raycaster, Vector3 } from "three";

export default class Collider {
    constructor(mesh, wrapper, radius) {
        this.mesh = mesh;
        this.radius = radius
        this.wrapper = wrapper;
        this.raycaster = new Raycaster();
        this.activeCollisions = [];
    }

    update() {
        if (!this.mesh) return;

        this.collidables = [];
        this.wrapper.children.forEach(c => {
            if (c.type == "Mesh") this.collidables.push(c);
        });

        this.activeCollisions.splice(0);
        this.collidables.forEach(obj => {
            const dir = new Vector3(0, 0, 1);
            dir.subVectors(obj.position, this.mesh.position);
            this.raycaster.set(this.mesh.position, dir.normalize());
            this.raycaster.far = this.radius;
            const intersections = this.raycaster.intersectObject(obj);
            this.activeCollisions.push(...intersections);
        });
    }
}