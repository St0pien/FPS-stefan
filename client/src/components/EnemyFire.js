import * as THREE from "three";
import LinearSpline from "./LinearSpline";
import fire from "../assets/textures/fire/fire.png";
import vs from "../shaders/particle.vert";
import fs from "../shaders/particle.frag";
import { Vector3 } from "three";
import GUI from './GUI';


export default class EnemyFire {
    constructor(params) {
        const uniforms = {
            diffuseTexture: {
                value: new THREE.TextureLoader().load(fire)
            },
            pointMultiplier: {
                value: window.innerHeight / (8.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
            }
        };

        this.rate = 300;

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.OneFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });

        this.camera = params.camera;
        this.particles = [];

        this.geometry = new THREE.BufferGeometry();

        this.points = new THREE.Points(this.geometry, this.material);

        params.scene.add(this.points);
        this.parent = params.parent;

        this.alphaSpline = new LinearSpline((t, a, b) => {
            return a + t * (b - a);
        });
        this.alphaSpline.addPoint(0.0, 0.0);
        this.alphaSpline.addPoint(0.1, 1.0);
        this.alphaSpline.addPoint(0.8, 1.0);
        this.alphaSpline.addPoint(1.0, 0.0);

        this.colourSpline = new LinearSpline((t, a, b) => {
            const c = a.clone();
            return c.lerp(b, t);
        });
        this.colourSpline.addPoint(0.0, new THREE.Color(0xff4512));
        this.colourSpline.addPoint(1.0, new THREE.Color(0x000000));

        this.sizeSpline = new LinearSpline((t, a, b) => {
            return a + t * (b - a);
        });
        this.sizeSpline.addPoint(0.0, 2.0);
        this.sizeSpline.addPoint(0.5, 10.0);
        this.sizeSpline.addPoint(1.0, 2.0);

        this.velocitySpline = new LinearSpline((t, a, b) => {
            const v = a.clone();
            return v.lerp(b, t);
        });
        this.velocitySpline.addPoint(0.0, new Vector3(1, 1, 1));
        this.velocitySpline.addPoint(0.2, new Vector3(1, 1, 1));
        this.velocitySpline.addPoint(0.8, new Vector3(1, 20, 0.7));

        this.updateGeometry();
    }

    addParticles(timeElapsed) {
        if (!this.delay) {
            this.delay = 0.0;
        }

        const options = GUI.getOptions();

        this.delay += timeElapsed;
        const calculatedRate = this.rate;
        const n = Math.floor(this.delay * calculatedRate);
        this.delay -= n / calculatedRate;

        for (let i = 0; i < n; i++) {
            const life = (Math.random() * 0.75 + 0.25) * 1.0;
            this.particles.push({
                position: new THREE.Vector3(
                    (Math.random() * 2 - 1) * 2.0 * options['attack-spread'],
                    (Math.random() * 2 - 1) * 2.0 * options['attack-spread'],
                    (Math.random() * 2 - 1) * 2.0 * options['attack-spread']),
                size: (Math.random() * 0.5 + 0.5) * 5.0 * options['attack-size'],
                colour: new THREE.Color(),
                alpha: 1.0,
                life: life,
                maxLife: life,
                rotation: Math.random() * 2.0 * Math.PI,
                velocity: new THREE.Vector3(0, 2, 70),
            });
        }
    }

    updateGeometry() {
        const positions = [];
        const sizes = [];
        const colours = [];
        const angles = [];
        const blends = [];

        for (let p of this.particles) {
            positions.push(p.position.x, p.position.y, p.position.z);
            colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
            sizes.push(p.currentSize);
            angles.push(p.rotation);
            const blend = ((p.maxLife - p.life) / p.maxLife) - 0.1;
            blends.push(blend);
        }

        this.geometry.setAttribute(
            'position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute(
            'size', new THREE.Float32BufferAttribute(sizes, 1));
        this.geometry.setAttribute(
            'colour', new THREE.Float32BufferAttribute(colours, 4));
        this.geometry.setAttribute(
            'angle', new THREE.Float32BufferAttribute(angles, 1));
        this.geometry.setAttribute(
            'blend', new THREE.Float32BufferAttribute(blends, 1));

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        this.geometry.attributes.colour.needsUpdate = true;
        this.geometry.attributes.angle.needsUpdate = true;
    }

    updateParticles(timeElapsed) {
        for (let p of this.particles) {
            p.life -= timeElapsed;
        }

        this.particles = this.particles.filter(p => {
            return p.life > 0.0;
        });

        for (let p of this.particles) {
            const t = 1.0 - p.life / p.maxLife;

            p.rotation += timeElapsed * 0.5;
            p.alpha = this.alphaSpline.get(t);
            p.currentSize = p.size * this.sizeSpline.get(t);
            p.colour.copy(this.colourSpline.get(t));

            const velocity = p.velocity.clone();

            velocity.applyEuler(this.parent.rotation);


            p.position.add(velocity.clone().multiplyScalar(timeElapsed).multiply(this.velocitySpline.get(t)));

            const drag = p.velocity.clone();
            drag.multiplyScalar(timeElapsed * 0.1);
            drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
            drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
            drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
            p.velocity.sub(drag);
        }

        this.particles.sort((a, b) => {
            const d1 = this.camera.position.distanceTo(a.position);
            const d2 = this.camera.position.distanceTo(b.position);

            if (d1 > d2) {
                return -1;
            }

            if (d1 < d2) {
                return 1;
            }

            return 0;
        });
    }

    update(timeElapsed) {
        this.updateParticles(timeElapsed);
        this.updateGeometry();
    }
}