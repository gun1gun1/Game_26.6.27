export class HUD {
  constructor() {
    this._build();
  }

  _build() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      #hud-score {
        position:fixed; top:18px; left:50%; transform:translateX(-50%);
        font:bold 28px/1 Arial,sans-serif; color:#fff;
        text-shadow:0 2px 8px rgba(0,0,0,.6);
        pointer-events:none; white-space:nowrap;
      }
      #hud-speed {
        position:fixed; bottom:18px; right:18px;
        font:15px Arial,sans-serif; color:rgba(255,255,255,.85);
        text-shadow:0 1px 4px rgba(0,0,0,.5);
        pointer-events:none;
      }
      #hud-overlay {
        position:fixed; inset:0;
        display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        background:rgba(0,30,60,.55);
        font-family:Arial,sans-serif; color:#fff;
        text-shadow:0 2px 8px rgba(0,0,0,.7);
        user-select:none;
      }
      #hud-overlay h1 { font-size:clamp(36px,8vw,64px); margin:0; letter-spacing:2px; }
      #hud-overlay .sub { font-size:clamp(14px,3vw,20px); margin:10px 0 0; opacity:.9; }
      #hud-overlay .hint { font-size:clamp(12px,2.5vw,16px); opacity:.65; margin-top:6px; }
      #hud-overlay .tap { font-size:clamp(16px,3.5vw,22px); margin-top:34px; animation:pulse 1s infinite; }
    `;
    document.head.appendChild(style);

    this.scoreEl = document.createElement('div');
    this.scoreEl.id = 'hud-score';

    this.speedEl = document.createElement('div');
    this.speedEl.id = 'hud-speed';

    this.overlayEl = document.createElement('div');
    this.overlayEl.id = 'hud-overlay';
    this.overlayEl.innerHTML = `
      <h1>✈ 스카이 러너</h1>
      <p class="sub">황금 링을 통과해 점수를 모으세요</p>
      <p class="hint">마우스 또는 터치로 조종</p>
      <p class="tap">탭하여 시작</p>
    `;

    document.body.append(this.scoreEl, this.speedEl, this.overlayEl);
  }

  showGame() {
    this.overlayEl.style.display = 'none';
    this.scoreEl.textContent = '링 0개';
    this.speedEl.textContent = '속도 200';
  }

  showGameOver(score) {
    this.overlayEl.style.display = 'flex';
    this.overlayEl.innerHTML = `
      <h1>충돌!</h1>
      <p class="sub">통과한 링: <strong style="color:#ffcc00">${score}개</strong></p>
      <p class="tap">탭하여 재시작</p>
    `;
  }

  updateScore(n) {
    this.scoreEl.textContent = `링 ${n}개`;
  }

  updateSpeed(n) {
    this.speedEl.textContent = `속도 ${n}`;
  }
}
