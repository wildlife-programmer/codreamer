class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speedX = Math.floor(Math.random() * 10 - 5) / 10;
    this.speedY = Math.floor(Math.random() * 10 - 5) / 10;
  }
  update(canvas, ctx) {
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    this.x += this.speedX;
    this.y += this.speedY;

    ctx.beginPath();
    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius / 4,
      this.x,
      this.y,
      this.radius
    );
    g.addColorStop(0, "rgba(255, 237, 44, 1)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
  relocate(x, y) {
    this.x = x;
    this.y = y;
  }
}

class FallingStar {
  constructor(x, y, t, c) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 4 - 2;
    this.weight = 1;
    this.radius = 10;
    this.title = t;
    this.content = c;

    this.rotate = 0;
  }
  update(canvas, ctx) {
    this.y += this.weight;
    this.x += this.speedX;
    this.weight += 0.03;

    if (this.speedX > 0) this.rotate -= 1;
    else this.rotate += 1;

    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
      this.weight = 1;
    }
    if (
      (this.y > this.title.y &&
        this.y < this.title.y + 5 &&
        this.x > this.title.x &&
        this.x < this.title.x + this.title.width) ||
      (this.y > this.content.y &&
        this.y < this.content.y + 5 &&
        this.x > this.content.x &&
        this.x < this.content.x + this.content.width)
    ) {
      this.y -= 10;
      this.weight *= -0.7;
    }
    this.drawShape(canvas, ctx, this.x, this.y, this.rotate);
  }
  relocate(x, y, title_top, content_top) {
    this.x = x;
    this.y = y;
    this.title_top = title_top;
    this.content_top = content_top;
  }
  drawShape(canvas, ctx, x, y, rotate, inset = 0.5, n = 6) {
    ctx.strokeStyle = "rgba(255, 237, 44, 1)";
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate);
    ctx.moveTo(0, 0 - this.radius);

    for (let i = 0; i < n; i++) {
      ctx.lineTo(0, 0 - this.radius);
      ctx.rotate(Math.PI / n);
      ctx.lineTo(0, 0 - this.radius * inset);
      ctx.rotate(Math.PI / n);
    }
    ctx.restore();
    ctx.closePath();
    ctx.stroke();
    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius / 4,
      this.x,
      this.y,
      this.radius
    );
    g.addColorStop(0, "rgba(255, 237, 44, 1)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fill();
  }
}

export { Dot };
export { FallingStar };
