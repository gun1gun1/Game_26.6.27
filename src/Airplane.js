import * as THREE from 'three';

export class Airplane {
  constructor(scene) {
    this.group = new THREE.Group();
    this._buildMesh();
    scene.add(this.group);

    this.x = 0;
    this.y = 0;
    this.bounds = { x: 7, y: 4 };
    this.collisionRadius = 0.9;
  }

  _buildMesh() {
    const blue = new THREE.MeshPhongMaterial({ color: 0x2266dd });
    const white = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const grey = new THREE.MeshPhongMaterial({ color: 0xaaaacc });

    // Fuselage (cylinder along Z)
    const fuselage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.38, 3.8, 10),
      blue
    );
    fuselage.rotation.x = Math.PI / 2;

    // Nose cone pointing forward (-Z)
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.32, 1.2, 10),
      white
    );
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -2.5;

    // Main wings
    const wings = new THREE.Mesh(
      new THREE.BoxGeometry(7.5, 0.12, 1.6),
      blue
    );
    wings.position.set(0, -0.05, 0.3);

    // Horizontal stabilizer
    const hStab = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.1, 0.7),
      blue
    );
    hStab.position.set(0, 0, 1.6);

    // Vertical fin
    const vFin = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.0, 0.8),
      blue
    );
    vFin.position.set(0, 0.48, 1.6);

    // Engine pods under wings
    [-2.2, 2.2].forEach(side => {
      const pod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 1.1, 8),
        grey
      );
      pod.rotation.x = Math.PI / 2;
      pod.position.set(side, -0.28, 0.4);
      this.group.add(pod);
    });

    this.group.add(fuselage, nose, wings, hStab, vFin);
  }

  update(input, delta) {
    const targetX = input.x * this.bounds.x;
    const targetY = input.y * this.bounds.y;

    this.x += (targetX - this.x) * 6 * delta;
    this.y += (targetY - this.y) * 6 * delta;

    this.group.position.set(this.x, this.y, 0);

    // Visual banking based on movement direction
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    this.group.rotation.z = -dx * 0.25;
    this.group.rotation.x = dy * 0.08;
  }

  getPosition() {
    return { x: this.x, y: this.y, z: 0 };
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0, 0, 0);
  }
}
