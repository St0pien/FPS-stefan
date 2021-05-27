import { AmbientLight, DefaultLoadingManager, Scene, Vector3 } from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";
import HttpService from "./HttpService";
import Maze from "./Maze";
import Player from "./Player";
import EnemyFire from "./EnemyFire";


export default class World {
    constructor(root) {
        this.root = root;
        this.loadingScreen = document.querySelector('.loading-screen');
        this.scene = new Scene();
        this.renderer = new Renderer(this.root);
        this.player = new Player(this.scene);
        this.camera = new Camera(this.renderer.threeRenderer, this.player);
        this.ambient = new AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambient);

        this.render();

        const baseurl = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : "/";
        this.httpService = new HttpService(baseurl);
        this.loadLevel();

        DefaultLoadingManager.onLoad = () => {
            this.loadingScreen.remove();
        }
    }

    async loadLevel() {
        const items = await this.httpService.loadLevel();
        this.maze = new Maze(this.scene, items, this.camera.threeCamera, this.player.character);
    }

    render() {
        requestAnimationFrame((t) => {
            if (this.previousFrame === null) {
                this.previousFrame = t;
            }

            this.render();

            this.renderer.render(this.scene, this.camera.threeCamera);

            this.update(t - this.previousFrame);

            this.previousFrame = t;
        });
    }

    update(timeElapsed) {
        const time = timeElapsed * 0.001;

        this.camera.update();

        if (this.maze) {
            this.maze.update(time);
        }

        this.player.update(time);
    }
}