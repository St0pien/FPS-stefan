import EnemyFire from "./EnemyFire";
import LinearSpline from "./LinearSpline";
import { Vector3 } from "three";
import * as THREE from "three";

export default class PlayerFire extends EnemyFire {
    constructor(params) {
        super(params);
        this.rate = 800;
        this.colourSpline = new LinearSpline((t, a, b) => {
            const c = a.clone();
            return c.lerp(b, t);
        });
        this.colourSpline.addPoint(0.0, new THREE.Color(0x1ac6ed));
        this.colourSpline.addPoint(1.0, new THREE.Color(0x000000));

        this.velocitySpline = new LinearSpline((t, a, b) => {
            const v = a.clone();
            return v.lerp(b, t);
        });
        this.velocitySpline.addPoint(0.0, new Vector3(1, 1, 1));
        this.velocitySpline.addPoint(0.2, new Vector3(1, 1, 1));
        this.velocitySpline.addPoint(0.8, new Vector3(1, 10, 0.7));
    }
}