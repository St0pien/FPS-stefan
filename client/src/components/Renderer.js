import { PCFShadowMap, WebGLRenderer } from "three";

export default class Renderer {
    constructor (root) {
        this.root = root;
        this.threeRenderer = new WebGLRenderer({
            antialias: true
        });
        this.threeRenderer.setClearColor(0x333333);

        this.threeRenderer.shadowMap.enabled = true;
        this.threeRenderer.shadowMap.type = PCFShadowMap;
        this.threeRenderer.setPixelRatio(window.devicePixelRatio);

        this.root.appendChild(this.threeRenderer.domElement);
        this.updateSize();

        window.addEventListener('resize', () => this.updateSize())
    }

    updateSize() {
        this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene, camera) {
        this.threeRenderer.render(scene, camera);
    }
}