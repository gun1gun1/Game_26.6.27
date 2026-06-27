import * as THREE from 'three';

export class World {
  constructor(scene) {
    this.scrollers = [];
    this.windmillHubs = [];

    this._buildTerrain(scene);
    this._buildAlps(scene);
    this._buildFields(scene);
    this._buildClouds(scene);
    this._buildLandmarks(scene);
  }

  // Register an object to scroll along Z toward the camera and wrap around
  _scroll(obj, scene, { spawnZ = -160, despawnZ = 22, xRange = 25, y = 0 } = {}) {
    obj.position.set(
      (Math.random() - 0.5) * xRange * 2,
      y,
      -Math.random() * Math.abs(spawnZ)
    );
    this.scrollers.push({ obj, spawnZ, despawnZ, xRange });
    scene.add(obj);
  }

  _buildTerrain(scene) {
    // Green European farmland base
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 700),
      new THREE.MeshPhongMaterial({ color: 0x4a7c3f })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -15;
    scene.add(ground);
  }

  _buildAlps(scene) {
    // Fixed background mountains — static parallax
    for (let i = 0; i < 20; i++) {
      const h = 16 + Math.random() * 15;
      const r = 7 + Math.random() * 9;
      const group = new THREE.Group();

      const rock = new THREE.Mesh(
        new THREE.ConeGeometry(r, h, 7),
        new THREE.MeshPhongMaterial({ color: 0x7a8b8c })
      );
      group.add(rock);

      const snowH = h * 0.38;
      const snow = new THREE.Mesh(
        new THREE.ConeGeometry(r * 0.44, snowH, 7),
        new THREE.MeshPhongMaterial({ color: 0xeef2ff })
      );
      snow.position.y = h / 2 - snowH / 2 + 0.4;
      group.add(snow);

      group.position.set(
        (Math.random() - 0.5) * 220,
        -15 + h / 2,
        -110 - Math.random() * 70
      );
      scene.add(group);
    }
  }

  _buildFields(scene) {
    // Colorful European field patches: lavender, sunflower, wheat, poppy, vineyard
    const colors = [0xcc77ee, 0xffdd33, 0xffcc55, 0x55bb33, 0xff4455, 0x88cc44, 0xddaa33, 0xee99cc];
    for (let i = 0; i < 22; i++) {
      const w = 10 + Math.random() * 24;
      const d = 8 + Math.random() * 18;
      const patch = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshPhongMaterial({ color: colors[i % colors.length] })
      );
      patch.rotation.x = -Math.PI / 2;
      this._scroll(patch, scene, { spawnZ: -160, xRange: 32, y: -14.9 });
    }
  }

  _buildClouds(scene) {
    const mat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    for (let i = 0; i < 18; i++) {
      const group = new THREE.Group();
      for (let j = 0; j < 3 + Math.floor(Math.random() * 3); j++) {
        const r = 0.8 + Math.random() * 1.3;
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 7), mat);
        sphere.position.set(
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 0.9,
          (Math.random() - 0.5) * 2
        );
        group.add(sphere);
      }
      const s = 1.3 + Math.random() * 1.6;
      group.scale.set(s, s * 0.55, s);
      this._scroll(group, scene, { spawnZ: -170, xRange: 20, y: 3 + Math.random() * 7 });
    }
  }

  _buildLandmarks(scene) {
    // Windmills
    for (let i = 0; i < 5; i++) {
      const { group, hub } = this._makeWindmill();
      this.windmillHubs.push({ hub, speed: 0.7 + Math.random() * 1.2 });
      this._scroll(group, scene, { xRange: 22, y: -15 });
    }
    // Medieval castles
    for (let i = 0; i < 3; i++) {
      this._scroll(this._makeCastle(), scene, { xRange: 20, y: -15 });
    }
    // Churches with spires
    for (let i = 0; i < 3; i++) {
      this._scroll(this._makeChurch(), scene, { xRange: 20, y: -15 });
    }
    // Eiffel Tower (rare landmark)
    this._scroll(this._makeEiffelTower(), scene, { xRange: 14, y: -15 });
  }

  _makeWindmill() {
    const group = new THREE.Group();
    const cream = new THREE.MeshPhongMaterial({ color: 0xddddbb });
    const brown = new THREE.MeshPhongMaterial({ color: 0x8b6914 });
    const red = new THREE.MeshPhongMaterial({ color: 0xaa3322 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.0, 5.5, 8), cream);
    body.position.y = 2.75;

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.3, 8), red);
    cap.position.y = 6.15;

    const hub = new THREE.Group();
    hub.position.set(0, 4.5, 0.7);
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.4, 0.08), brown);
      blade.position.y = 1.7;
      const arm = new THREE.Group();
      arm.rotation.z = (i / 4) * Math.PI * 2;
      arm.add(blade);
      hub.add(arm);
    }

    group.add(body, cap, hub);
    return { group, hub };
  }

  _makeCastle() {
    const group = new THREE.Group();
    const stone = new THREE.MeshPhongMaterial({ color: 0xbbbbaa });
    const roof = new THREE.MeshPhongMaterial({ color: 0x3a5a8a });

    const keep = new THREE.Mesh(new THREE.BoxGeometry(2.8, 5.5, 2.8), stone);
    keep.position.y = 2.75;
    group.add(keep);

    const battlements = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.6, 3.2), stone);
    battlements.position.y = 5.8;
    group.add(battlements);

    [[-1.7, -1.7], [1.7, -1.7], [-1.7, 1.7], [1.7, 1.7]].forEach(([x, z]) => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.65, 5, 8), stone);
      tower.position.set(x, 2.5, z);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.75, 2.2, 8), roof);
      cone.position.set(x, 6.1, z);
      group.add(tower, cone);
    });

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5, 4), stone);
    pole.position.y = 7.25;
    const flag = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.06),
      new THREE.MeshPhongMaterial({ color: 0xdd2222 }));
    flag.position.set(0.5, 8.2, 0);
    group.add(pole, flag);

    return group;
  }

  _makeChurch() {
    const group = new THREE.Group();
    const stone = new THREE.MeshPhongMaterial({ color: 0xccccbb });
    const copper = new THREE.MeshPhongMaterial({ color: 0x4a8a5a });

    const nave = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.0, 6), stone);
    nave.position.y = 1.5;
    group.add(nave);

    // Nave roof (pyramid shape using CylinderGeometry with top radius 0)
    const naveRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 2.5, 1.8, 4), copper);
    naveRoof.position.y = 3.9;
    group.add(naveRoof);

    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6, 1.4), stone);
    tower.position.set(0, 3, -3.2);
    group.add(tower);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.8, 5, 8), copper);
    spire.position.set(0, 8.5, -3.2);
    group.add(spire);

    // Rose window (decorative circle)
    const window = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 6, 12),
      new THREE.MeshPhongMaterial({ color: 0x88aacc, emissive: 0x224466, emissiveIntensity: 0.3 }));
    window.position.set(0, 2.5, 3.01);
    group.add(window);

    return group;
  }

  _makeEiffelTower() {
    const group = new THREE.Group();
    const iron = new THREE.MeshPhongMaterial({ color: 0x8b7355 });
    const gold = new THREE.MeshPhongMaterial({ color: 0xffcc00 });

    // Four slanted base legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 5, 6), iron);
      leg.position.set(x * 0.5, 2.5, z * 0.5);
      leg.rotation.z = x < 0 ? 0.2 : -0.2;
      leg.rotation.x = z < 0 ? 0.2 : -0.2;
      group.add(leg);
    });

    // First platform
    const plat1 = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.22, 8), iron);
    plat1.position.y = 5;
    group.add(plat1);

    // Middle tapered section
    const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 1.0, 3.2, 8), iron);
    mid.position.y = 6.9;
    group.add(mid);

    // Second platform
    const plat2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8), iron);
    plat2.position.y = 8.6;
    group.add(plat2);

    // Spire
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.38, 4.5, 8), iron);
    spire.position.y = 11;
    group.add(spire);

    // Golden tip
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 1.2, 6), gold);
    tip.position.y = 13.5;
    group.add(tip);

    return group;
  }

  update(speed, delta) {
    this.windmillHubs.forEach(({ hub, speed: s }) => {
      hub.rotation.z -= delta * s;
    });

    this.scrollers.forEach(({ obj, spawnZ, despawnZ, xRange }) => {
      obj.position.z += speed * delta;
      if (obj.position.z > despawnZ) {
        obj.position.z = spawnZ;
        obj.position.x = (Math.random() - 0.5) * xRange * 2;
      }
    });
  }
}
