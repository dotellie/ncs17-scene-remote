// I know this isn't hidpi but let's be honest, did you notice that before looking
// at the code anyway?

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const ripples = [];

const animate = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);

    ripples.forEach(ripple => {
        ripple.update();
        ripple.render(c);
        if (ripple.dead) ripples.splice(ripples.indexOf(ripple), 1);
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
    constructor(x, y, r = 0) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    get dead() {
        const w = window.innerWidth, h = window.innerHeight;
        return this.r > Math.sqrt(w * w + h * h);
    }

    update() {
        if (this.r < 0) this.r++;
        else this.r += 20;
    }

    render(c) {
        if (this.r < 0) return;

        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.lineWidth = 2;
        c.strokeStyle = "rgba(255, 255, 255, 0.7)";
        c.stroke();
        c.closePath();
    }
}

export default (x, y, r) => {
    ripples.push(new Ripple(x, y, r));
};
