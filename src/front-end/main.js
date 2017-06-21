import anime from "animejs";

import animateButton from "./animate-button.js";
import addRipple from "./ripple.js";

import "style-loader!./style.css";

const nextBtn = document.querySelector(".next.button");
const backBtn = document.querySelector(".back.button");

anime({
    targets: "#playpause-button polygon",
    points: "0 0 26 16 26 16 0 32",
    easing: "easeInOutExpo"
});

animateButton(nextBtn);
animateButton(backBtn);

nextBtn.onclick = () => {
    const center = getElCenter(nextBtn);
    addRipple(center.x, center.y);
    // addRipple(center.x, center.y, 5);
    addRipple(center.x, center.y, 10);
};

const getElCenter = el => {
    const { top, left, width, height } = el.getBoundingClientRect();
    return { x: left + width / 2, y: top + height / 2 };
};
