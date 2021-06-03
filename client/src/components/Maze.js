import { Group, Mesh, MeshPhongMaterial, PlaneGeometry } from "three";
import { Wall, Enemy, Treasure, Light } from "./LevelItems";
import { floorMaterial, ceilingMaterial } from "./Materials";

export default class Maze {
    constructor(scene, levelItems, camera, player, size=10, squareSize=100) {
        this.size = size;
        this.squareSize = squareSize;
        this.scene = scene;
        this.levelItems = [];
        this.camera = camera;
        this.player = player

        let enemyCount = 0;
        levelItems.forEach(item => {
            item.z = -item.z;
            item.z += this.size-1;
            item.x += 1/2;
            item.z += 1/2;
            switch (item.type) {
                case "wall": this.levelItems.push(new Wall(item.x, 0, item.z, this.squareSize, this.scene));
                break;

                case "enemy": this.levelItems.push(new Enemy(item.x, 0, item.z, this.squareSize, this.scene, this.player, this.camera, enemyCount++));
                break;
                
                case "treasure": this.levelItems.push(new Treasure(item.x, 0, item.z, this.squareSize, this.scene));
                break;

                case "light": this.levelItems.push(new Light(item.x, 0, item.z, this.squareSize, this.scene, this.camera));
                break;
            }
        });

        const geometry = new PlaneGeometry(this.size*this.squareSize, this.size*this.squareSize);

        this.floor = new Mesh(geometry, floorMaterial);
        this.floor.receiveShadow = true;
        this.floor.position.set(this.size*this.squareSize / 2, 0, this.size*this.squareSize/2);
        this.floor.rotateX(-Math.PI/2);
        this.scene.add(this.floor);

        this.ceiling = new Mesh(geometry, ceilingMaterial);
        this.ceiling.receiveShadow = true;
        this.ceiling.position.set(this.size*this.squareSize / 2, 100, this.size*this.squareSize/2);
        this.ceiling.rotateX(Math.PI/2);
        this.scene.add(this.ceiling);
    }

    update(time) {
        this.levelItems.forEach(i => {
            i.update(time);
        });
    }
}