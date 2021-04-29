import { Group, Mesh, MeshPhongMaterial, PlaneGeometry } from "three";
import { Wall, Enemy, Treasure, Light } from "./LevelItems";

export default class Maze {
    constructor(scene, levelItems, size=10, squareSize=100) {
        this.size = size;
        this.squareSize = squareSize;
        this.scene = scene;
        this.levelItems = [];
        this.group = new Group();

        levelItems.forEach(item => {
            item.z = -item.z;
            item.z += this.size-1;
            item.x += 1/2;
            item.z += 1/2;
            switch (item.type) {
                case "wall": this.levelItems.push(new Wall(item.x, 0, item.z, this.squareSize));
                break;

                case "enemy": this.levelItems.push(new Enemy(item.x, 0, item.z, this.squareSize));
                break;
                
                case "treasure": this.levelItems.push(new Treasure(item.x, 0, item.z, this.squareSize));
                break;

                case "light": this.levelItems.push(new Light(item.x, 0, item.z, this.squareSize));
                break;
            }
        });

        this.group.add(...this.levelItems.map(i => i.obj));
        this.scene.add(this.group);

        const geometry = new PlaneGeometry(this.size*this.squareSize, this.size*this.squareSize);
        let material = new MeshPhongMaterial({
            color: 0x333333,
        });
        this.floor = new Mesh(geometry, material);
        this.floor.receiveShadow = true;
        this.floor.position.set(this.size*this.squareSize / 2, 0, this.size*this.squareSize/2);
        this.floor.rotateX(-Math.PI/2);
        this.scene.add(this.floor);

        material = new MeshPhongMaterial({
            color: 0xaaaaaa,
        })
        this.ceiling = new Mesh(geometry, material);
        this.ceiling.receiveShadow = true;
        this.ceiling.position.set(this.size*this.squareSize / 2, 100, this.size*this.squareSize/2);
        this.ceiling.rotateX(Math.PI/2);
        this.scene.add(this.ceiling);
    }

    update() {
        this.levelItems.forEach(i => {
            i.update();
        });
    }
}