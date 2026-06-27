import * as THREE from 'three';
import { Airplane } from './Airplane.js';
import { World } from './World.js';
import { ObstacleManager } from './ObstacleManager.js';
import { InputManager } from './InputManager.js';
import { HUD } from './HUD.js';

export class Game {
  constructor() {
    this.state = 'idle';
    this.score = 0;
    this.speed = 20;
    this.elapsed = 0;

    this._initRenderer();
    this._initScene();
    this._initModules();
    this._bindResize();
    this._bindStart();

    this.clock = new THREE.Clock();
    this._loop();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    // European afternoon sky — rich azure with warm horizon
    this.scene.background = new THREE.Color(0x6ab4e8);
    this.scene.fog = new THREE.Fog(0x8ecbe8, 55, 250);

    this.camera = new THREE.PerspectiveCamera(
      65, window.innerWidth / window.innerHeight, 0.1, 320
    );
    // Higher and slightly farther back to show more landscape below
    this.camera.position.set(0, 7, 16);
    this.camera.lookAt(0, -4, -14);

    // Warm afternoon ambient
    this.scene.add(new THREE.AmbientLight(0xffeedd, 0.6));
    // Golden afternoon sun from the side (French Riviera feel)
    const sun = new THREE.DirectionalLight(0xffd080, 1.2);
    sun.position.set(25, 18, 8);
    this.scene.add(sun);
    // Soft fill from the sky
    const skyFill = new THREE.DirectionalLight(0xaaddff, 0.3);
    skyFill.position.set(-10, 10, 5);
    this.scene.add(skyFill);
  }

  _initModules() {
    this.input = new InputManager();
    this.airplane = new Airplane(this.scene);
    this.world = new World(this.scene);
    this.obstacles = new ObstacleManager(this.scene);
    this.hud = new HUD();
  }

  _bindResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  _bindStart() {
    const handler = () => {
      if (this.state === 'idle' || this.state === 'gameover') this._start();
    };
    window.addEventListener('click', handler);
    window.addEventListener('touchend', handler);
  }

  _start() {
    this.state = 'playing';
    this.score = 0;
    this.speed = 20;
    this.elapsed = 0;
    this.airplane.reset();
    this.obstacles.reset();
    this.hud.showGame();
  }

  _loop() {
    requestAnimationFrame(() => this._loop());
    const delta = Math.min(this.clock.getDelta(), 0.05);

    if (this.state === 'playing') {
      this.elapsed += delta;
      this.speed = 20 + this.elapsed * 0.4;

      this.airplane.update(this.input, delta);
      this.world.update(this.speed, delta);

      const pos = this.airplane.getPosition();
      const result = this.obstacles.update(this.speed, delta, pos);

      if (result.scored) {
        this.score++;
        this.hud.updateScore(this.score);
      }
      if (result.hit) {
        this.state = 'gameover';
        this.hud.showGameOver(this.score);
      }

      // Soft camera follow — slightly higher base to keep landscape in frame
      const camTargetX = pos.x * 0.25;
      const camTargetY = pos.y * 0.2 + 7;
      this.camera.position.x += (camTargetX - this.camera.position.x) * 4 * delta;
      this.camera.position.y += (camTargetY - this.camera.position.y) * 4 * delta;
      // Look toward a point below and ahead so landscape is always visible
      this.camera.lookAt(pos.x * 0.35, pos.y * 0.25 - 4, -14);

      this.hud.updateSpeed(Math.round(this.speed * 10));
    }

    this.renderer.render(this.scene, this.camera);
  }
}
