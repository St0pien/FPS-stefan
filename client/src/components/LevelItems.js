import { BoxGeometry, DoubleSide, Mesh, MeshPhongMaterial, Object3D, PointLight, Vector3, Group } from "three";
import GUI from "./GUI";
import EnemyController from "./EnemyController";
import { wallMaterial } from "./Materials";
import ParticleSystem from "./ParticleSystem";


class LevelItem {
    obj = new Object3D();

    constructor(x, y, z, type, squareSize, scene) {
        this.position = new Vector3(x, y, z);
        this.type = type;
        this.squareSize = squareSize
        this.scene = scene;
    }

    setPosition() {
        this.obj.position.set(this.position.x * this.squareSize, this.position.y * this.squareSize + this.squareSize/2, this.position.z * this.squareSize)
    }

    update() {
        if (GUI.getOptions().shadows) {
            if (!this.obj.castShadow) {
                this.obj.castShadow = true;
                this.obj.receiveShadow = true;
            }
        } else {
            this.obj.castShadow = false;
            this.obj.receiveShadow = false;
        }
    }
}

export class Wall extends LevelItem {
    constructor(x, y, z, squareSize, scene) {
        super(x, y, z, "wall", squareSize, scene);
        this.geometry = new BoxGeometry(this.squareSize, this.squareSize, this.squareSize);
        this.material = wallMaterial;

        this.obj = new Mesh(this.geometry, this.material);
        this.scene.add(this.obj);
        this.setPosition();
    }
}

export class Enemy extends LevelItem {
    constructor(x, y, z, squareSize, scene, player) {
        super(x, y, z, "enemy", squareSize, scene);
        this.controller = new EnemyController({
            scene: this.scene,
            position: new Vector3(x * this.squareSize, 0.25, z * this.squareSize),
            target: player
        });
    }

    update(time) {
        this.controller.update(time);
    }
}

export class Treasure extends LevelItem {
    constructor(x, y, z, squareSize, scene) {
        super(x, y, z, "treasure", squareSize, scene);
        const geometry = new BoxGeometry(this.squareSize, this.squareSize, this.squareSize);
        const material = new MeshPhongMaterial({
            color: 0x0000ff,
            side: DoubleSide,
        })
        this.obj = new Mesh(geometry, material);
        this.scene.add(this.obj);
        this.setPosition();
    }
}

export class Light extends LevelItem {
    constructor(x, y, z, squareSize, scene, camera) {
        super(x, y, z, "light", squareSize, scene);
        this.obj = new Group();

        this.light = new PointLight(0xffbd24, 1, 1000);
        this.light.castShadow = true;
        this.obj.add(this.light);

        this.fire = new ParticleSystem({
            parent: this.obj,
            camera: camera
        })

        this.setPosition();
        this.obj.position.y = 10;
        this.fire.points.position.set(0, -10, 0);
        this.scene.add(this.obj);
    }

    update(time) {
        if (GUI.getOptions().shadows) {
            if (!this.obj.castShadow) {
                this.light.castShadow = true;
            }
        } else {
            this.light.castShadow = false;
        }

        this.light.intensity = GUI.getOptions()['light-intensity'];

        this.fire.update(time);
    }
}
