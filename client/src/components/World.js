import { AmbientLight, Scene } from "three";
import Renderer from "./Renderer";
import Camera from "./Camera";
import HttpService from "./HttpService";
import Maze from "./Maze";
import Player from "./Player";

export default class World {
    constructor(root) {
        this.root = root;
        this.scene = new Scene();
        this.renderer = new Renderer(this.root);
        this.player = new Player(this.scene);
        this.camera = new Camera(this.renderer.threeRenderer, this.player.obj);
        this.ambient = new AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambient);

        this.render();

        const baseurl = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : "/";
        this.httpService = new HttpService(baseurl);
        this.loadLevel();
    }

    async loadLevel() {
        const items = await this.httpService.loadLevel();
        this.maze = new Maze(this.scene, items);
    }

    render() {
        this.renderer.render(this.scene, this.camera.threeCamera);
        
        this.camera.update();

        if (this.maze) {
            this.maze.update();
        }

        requestAnimationFrame(() => this.render());
    }
}