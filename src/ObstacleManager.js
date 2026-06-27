import * as THREE from 'three';

const RING_RADIUS = 3.0;
const SPAWN_Z = -140;

export class ObstacleManager {
  constructor(scene) {
    this.rings = [];
    this.spawnTimer = 0;
    this.spawnInterval = 2.8;

    for (let i = 0; i < 8; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(RING_RADIUS, 0.28, 10, 32),
        new THREE.MeshPhongMaterial({
          color: 0xffcc00,
          emissive: 0xff8800,
          emissiveIntensity: 0.4,
        })
      );
      ring.userData = { active: false, checked: false };
      ring.visible = false;
      this.rings.push(ring);
      scene.add(ring);
    }
  }

  _spawn() {
    const ring = this.rings.find(r => !r.userData.active);
    if (!ring) return;

    ring.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 5 + 0.5,
      SPAWN_Z
    );
    ring.rotation.set(0, (Math.random() - 0.5) * 0.4, 0);
    ring.userData.active = true;
    ring.userData.checked = false;
    ring.visible = true;
  }

  update(speed, delta, airplanePos) {
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this._spawn();
      this.spawnTimer = 0;
    }

    let scored = false;
    let hit = false;

    for (const ring of this.rings) {
      if (!ring.userData.active) continue;

      ring.position.z += speed * delta;
      ring.rotation.z += delta * 0.6;

      // Check collision when ring is at airplane's Z depth
      if (!ring.userData.checked && Math.abs(ring.position.z) < 2) {
        ring.userData.checked = true;
        const dx = airplanePos.x - ring.position.x;
        const dy = airplanePos.y - ring.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2.2) {
          scored = true;
          ring.visible = false;
          ring.userData.active = false;
        } else if (dist < RING_RADIUS + 0.8) {
          hit = true;
        }
      }

      if (ring.position.z > 15) {
        ring.userData.active = false;
        ring.visible = false;
      }
    }

    return { scored, hit };
  }

  reset() {
    this.rings.forEach(r => {
      r.userData.active = false;
      r.userData.checked = false;
      r.visible = false;
    });
    this.spawnTimer = 0;
    this.spawnInterval = 2.8;
  }
}
