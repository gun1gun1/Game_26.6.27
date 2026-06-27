# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

3D airplane game built with **Three.js** running in the web browser. No backend required — purely client-side HTML/CSS/JavaScript.

## Tech Stack

- **Three.js** — 3D rendering (WebGL abstraction)
- **Vite** — dev server and bundler (fast HMR)
- **Vanilla JavaScript (ES modules)** — no framework
- **npm** — package manager

## Commands

```bash
# Install dependencies
npm install

# Start dev server (hot reload at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

The game follows a **scene graph + game loop** pattern typical of Three.js projects.

```
src/
  main.js          # Entry point: initializes renderer, scene, camera, starts game loop
  game/
    Game.js        # Core game loop (update + render), owns Scene/Camera/Renderer
    Airplane.js    # Player airplane: mesh, physics, input handling
    World.js       # Environment: terrain/ocean, sky, obstacles
    Enemy.js       # Enemy aircraft AI and spawning
    Bullet.js      # Projectile pooling and collision
  ui/
    HUD.js         # DOM-based HUD (health, score, altitude)
  utils/
    InputManager.js  # Keyboard/mouse/gamepad input abstraction
    CollisionManager.js  # AABB / sphere collision detection
```

### Game Loop

`Game.js` drives everything via `requestAnimationFrame`. Each frame:
1. `InputManager` reads raw input
2. `Airplane.update(delta)` — applies physics, moves player
3. `World.update(delta)` — scrolls terrain, spawns enemies
4. `CollisionManager.check()` — resolves hits
5. `HUD.update()` — syncs DOM elements
6. `renderer.render(scene, camera)` — draws frame

### Three.js Conventions Used Here

- All game objects extend a base class that holds a `THREE.Group` as `this.mesh` — add `this.mesh` to the scene, not the object itself.
- Use `THREE.Clock` for `delta` time; never hardcode frame-rate assumptions.
- Assets (GLTF models, textures) loaded via `THREE.GLTFLoader` / `THREE.TextureLoader` in an `AssetLoader` utility that returns Promises; `Game.js` awaits all assets before starting the loop.
- Post-processing (bloom, depth of field) via `THREE.EffectComposer` if added.

### Coordinate System

Three.js uses a **right-handed Y-up** coordinate system:
- X → right, Y → up, Z → toward camera
- The airplane flies along the **−Z axis** (forward into the screen).

## Key Design Decisions

- **Object pooling** for bullets and particles — avoid GC spikes during gameplay.
- **DOM HUD** (not Three.js sprites) for clean text rendering and easy CSS styling.
- Physics is simple Euler integration — no physics library needed for arcade flight.
