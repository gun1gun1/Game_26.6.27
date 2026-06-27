export class InputManager {
  constructor() {
    this.x = 0;
    this.y = 0;
    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('mousemove', e => {
      this.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.y = -((e.clientY / window.innerHeight) * 2 - 1);
    });

    window.addEventListener('touchmove', e => {
      e.preventDefault();
      const t = e.touches[0];
      this.x = (t.clientX / window.innerWidth) * 2 - 1;
      this.y = -((t.clientY / window.innerHeight) * 2 - 1);
    }, { passive: false });
  }
}
