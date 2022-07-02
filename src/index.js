const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// получаем положение мышки
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 150) * (canvas.width / 150)
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
// Создаем частицу
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  // метод для отрисовки каждой отдельной частицы
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop('0', 'red');
    gradient.addColorStop('0.14', 'orange');
    gradient.addColorStop('0.3', 'yellow');
    gradient.addColorStop('0.47', 'green');
    gradient.addColorStop('0.6', 'deepskyblue');
    gradient.addColorStop('0.8', 'blue');
    gradient.addColorStop('1.0', 'violet');
    ctx.fillStyle = gradient;
    //ctx.fillStyle = `rgba(255,40,40,1)`;
    ctx.fill();
  }

  // проверка положения частицы, положения мышки, движение частицы, рисование частицы
  update() {
    //проверка все ли еще частица находится внутри холста
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    // проверка столкновения - положение мышки / положение частицы (не работает как нужно)
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }
    // двигаем частицу
    this.x += this.directionX;
    this.y += this.directionY;
    // отрисовка частицы
    this.draw();
  }
}

// создаем массив частиц
const init = () => {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 17000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 5 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = `rgba(255,40,40,1)`;
    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
};

// Проверка близки ли частицы достаточно чтобы прорисовывать между ними линию
const connect = () => {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);
      if (distance < (canvas.width / 7) * (canvas.height / 10)) {
        let gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop('0', 'violet');
        gradient.addColorStop('0.14', 'blue');
        gradient.addColorStop('0.3', 'deepskyblue');
        gradient.addColorStop('0.47', 'green');
        gradient.addColorStop('0.6', 'yellow');
        gradient.addColorStop('0.8', 'orange');
        gradient.addColorStop('1.0', 'red');
        ctx.strokeStyle = gradient;

        //ctx.strokeStyle = `rgba(255,40,40,1)`;
        ctx.shadowBlur = 100;
        ctx.shadowColor = 'violet';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
};

// анимация
const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
};

// ресайз окна
window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.height / 80);
});
// когда мышка выходит за пределы окна
window.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();
animate();

const divClick = document.querySelector('.click');

// функция убегания дива
function escape(argument) {
  argument.style.transition = 'all .1s';
  argument.style.top = `${Math.floor(Math.random() * 60) + 30}%`;
  argument.style.left = `${Math.floor(Math.random() * 60) + 30}%`;
}

divClick.addEventListener('mouseover', function () {
  escape(this);
  //audio.play()
});

divClick.addEventListener('click', () => {
  alert('You win!');
  window.location =
    'https://www.ladbible.com/cdn-cgi/image/width=720,quality=70,format=jpeg,fit=pad,dpr=1/https%3A%2F%2Fs3-images.ladbible.com%2Fs3%2Fcontent%2F733ff9e65fdbed5b62b45728a7a76145.png';
});

setTimeout(() => {
  divClick.style.display = 'block';
}, 1000);

const audio = document.querySelector('#interstellar');

document.body.addEventListener('mouseover', () => {
  audio.play();
});
