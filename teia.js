// Teia animada
const canvas = document.getElementById('web-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let points = [];
const POINTS = 40;
const DIST = 120;
let mouse = { x: width / 2, y: height / 2 };

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createPoints() {
  points = [];
  for (let i = 0; i < POINTS; i++) {
    points.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3)
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  // desenha linhas entre pontos próximos
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let dx = points[i].x - points[j].x;
      let dy = points[i].y - points[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < DIST) {
        ctx.strokeStyle = `rgba(200,200,255,${1 - dist / DIST})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }
  // desenha linhas do mouse para pontos próximos
  for (let i = 0; i < points.length; i++) {
    let dx = points[i].x - mouse.x;
    let dy = points[i].y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < DIST) {
      ctx.strokeStyle = `rgba(255,255,255,${1 - dist / DIST})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }
  // desenha pontos
  for (let i = 0; i < points.length; i++) {
    ctx.fillStyle = "#b0c4de";
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function update() {
  for (let i = 0; i < points.length; i++) {
    // Movimento normal
    points[i].x += points[i].vx;
    points[i].y += points[i].vy;

    // Rebote nas bordas
    if (points[i].x < 0 || points[i].x > width) points[i].vx *= -1;
    if (points[i].y < 0 || points[i].y > height) points[i].vy *= -1;

    // Atração ao mouse
    let dx = mouse.x - points[i].x;
    let dy = mouse.y - points[i].y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < DIST) {
      // Força de atração proporcional à distância
      let force = (DIST - dist) / DIST * 0.05; // 0.05 controla a força
      points[i].vx += dx * force;
      points[i].vy += dy * force;
      // Limita a velocidade máxima
      points[i].vx = Math.max(Math.min(points[i].vx, 2), -2);
      points[i].vy = Math.max(Math.min(points[i].vy, 2), -2);
    }
  }
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', function() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  createPoints();
});

createPoints();
animate();