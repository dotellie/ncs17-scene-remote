import animateButton from "./animate-button.js";
import addRipple from "./ripple.js";
import { setPlayPauseCallback } from "./play-pause-button";

import "style-loader!./style.css";

const nextBtn = document.querySelector(".next.button");
const backBtn = document.querySelector(".back.button");

const clickHandler = btn => {
    const spawnRipple = () => {
        const circle = getElCircle(btn);
        addRipple(circle.x, circle.y, circle.r);
    };

    spawnRipple();
    setTimeout(spawnRipple, 200);
};

const getElCircle = el => {
    const { top, left, width, height } = el.getBoundingClientRect();
    return { x: left + width / 2, y: top + height / 2, r: width / 2 };
};

animateButton(nextBtn, clickHandler);
animateButton(backBtn, clickHandler);

setPlayPauseCallback(() => {});
