let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {

    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      this.handleMove(e.clientX, e.clientY, paper);
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;
      e.preventDefault();
      const touch = e.touches[0];

      if (!this.rotating) {
        this.mouseX = touch.clientX;
        this.mouseY = touch.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      this.handleMove(touch.clientX, touch.clientY, paper);
    }, { passive: false });

    paper.addEventListener('mousedown', (e) => {
      this.startDrag(e.clientX, e.clientY, e.button, paper);
    });

    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.startDrag(touch.clientX, touch.clientY, 0, paper);
    }, { passive: false });

    window.addEventListener('mouseup', () => this.stopDrag());
    window.addEventListener('touchend', () => this.stopDrag());
  }

  handleMove(x, y, paper) {
    const dirX = x - this.mouseTouchX;
    const dirY = y - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform =
        `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  startDrag(x, y, button, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.mouseTouchX = x;
    this.mouseTouchY = y;
    this.prevMouseX = x;
    this.prevMouseY = y;

    if (button === 2) {
      this.rotating = true;
    }
  }

  stopDrag() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
