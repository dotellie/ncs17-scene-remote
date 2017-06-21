const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const ripples = [];

const animate = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);

    ripples.forEach(ripple => {
        ripple.update();
        ripple.render(c);
    });

    requestAnimationFrame(animate);
};

const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

onResize();
animate();

window.addEventListener("resize", onResize);

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 1;
    }

    update() {
        this.r += 15;
    }

    render(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.lineWidth = 2;
        c.strokeStyle = "rgba(255, 255, 255, 0.7)";
        c.stroke();
        c.closePath();
    }
}

export default (x, y) => {
    ripples.push(new Ripple(x, y));
};
