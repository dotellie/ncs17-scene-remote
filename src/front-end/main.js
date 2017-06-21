import anime from "animejs";

import animateButton from "./animate-button.js";

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
