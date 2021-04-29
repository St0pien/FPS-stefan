import { BoxGeometry, DoubleSide, Mesh, MeshPhongMaterial, Object3D, PointLight, Vector3 } from "three";
import GUI from "./GUI";

class LevelItem {
    obj = new Object3D();

    constructor(x, y, z, type, squareSize) {
        this.position = new Vector3(x, y, z);
        this.type = type;
        this.squareSize = squareSize
    }

    setPosition() {
        this.obj.position.set(this.position.x * this.squareSize, this.position.y * this.squareSize + this.squareSize/2, this.position.z * this.squareSize)
    }

    update() {
        if (GUI.options.shadows.checked) {
            if (!this.obj.castShadow) {
                this.obj.castShadow = true;
            }
        } else {
            this.obj.castShadow = false;
        }
    }
}

export class Wall extends LevelItem {
    constructor(x, y, z, squareSize) {
        super(x, y, z, "wall", squareSize);
        const geometry = new BoxGeometry(this.squareSize, this.squareSize, this.squareSize);
        const material = new MeshPhongMaterial({
            color: 0x00ff00,
            side: DoubleSide,
            shininess: 1
        })
        this.obj = new Mesh(geometry, material);
        this.setPosition();
    }
}

export class Enemy extends LevelItem {
    constructor(x, y, z, squareSize) {
        super(x, y, z, "enemy", squareSize);
        const geometry = new BoxGeometry(this.squareSize, this.squareSize, this.squareSize);
        const material = new MeshPhongMaterial({
            color: 0xff0000,
            side: DoubleSide,
        })
        this.obj = new Mesh(geometry, material);
        this.setPosition();
    }
}

export class Treasure extends LevelItem {
    constructor(x, y, z, squareSize) {
        super(x, y, z, "treasure", squareSize);
        const geometry = new BoxGeometry(this.squareSize, this.squareSize, this.squareSize);
        const material = new MeshPhongMaterial({
            color: 0x0000ff,
            side: DoubleSide,
        })
        this.obj = new Mesh(geometry, material);
        this.setPosition();
    }
}

export class Light extends LevelItem {
    constructor(x, y, z, squareSize) {
        super(x, y, z, "light", squareSize);
        this.obj = new PointLight(0xfeffa6, 1, 1000);
        this.setPosition();
        this.obj.castShadow = true;
    }

    update() {
        if (GUI.options.shadows) {
            if (!this.obj.castShadow) {
                this.obj.castShadow = true;
            }
        }

        this.obj.intensity = parseFloat(GUI.options["light-density"].value);
    }
}
