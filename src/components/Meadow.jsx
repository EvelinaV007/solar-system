import React, { useEffect, useState } from "react";
import "../styles/Meadow.css";
import "css-doodle";

export default function Meadow({ onNext }) {
    const [isLaunched, setIsLaunched] = useState(false);

    useEffect(() => {
        const dood = document.getElementById("dood");
        const forest = document.getElementById("forest");

        function getCss(gridSize) {
            return `
      :doodle {
        @grid:${gridSize}/100%;
        width:100vw;
        height:100vh;
      }

      :after {
        content:@p(🦋);
      }

      @random(.15) {
        filter:hue-rotate(@r(-180deg, 180deg));
      }

      animation: fly @r(10s,20s) infinite linear;
      position:absolute;
      left:@r(100%);
      bottom:@r(75px,250px);

      @keyframes fly {
        0% {
          transform:
          translateX(@r(-20px,20px))
          translateY(@r(-20px,20px));
        }

        50% {
          transform:
          translateX(@r(-200px,200px))
          translateY(@r(-300px,-100px));
        }

        100% {
          transform: translateY(-100vh);
        }
      }
      `;
        }

        function generateTree(height, position) {
            let template = `
        <div class="tree__5"></div>
        <div class="tree__1"></div>
        <div class="tree__2"></div>
        <div class="tree__3"></div>
        <div class="tree__4" style="height:${height}px"></div>
      `;

            let el = document.createElement("div");

            el.className = "tree";
            el.style.left = `${position}%`;
            el.innerHTML = template;

            return el;
        }

        function initForest() {
            forest.innerHTML = "";

            let density = Math.floor(window.innerWidth / 10);

            for (let i = 0; i < density; i++) {
                let pos = Math.random() * 120 - 20;
                let hei = Math.floor(Math.random() * 250) + 50;

                forest.appendChild(generateTree(hei, pos));
            }

            dood.update(getCss(15));
        }

        initForest();

        window.addEventListener("resize", initForest);

        return () => {
            window.removeEventListener("resize", initForest);
        };
    }, []);

    const handleLaunch = () => {
        if (isLaunched) return;

        setIsLaunched(true);

        setTimeout(() => {
            if (onNext) onNext();
        }, 5000);
    };

    return (
        <div className={`scene ${isLaunched ? "night" : ""}`}>
            <div id="sun">🌞</div>

            <div id="forest"></div>

            {/* РАКЕТА ТЕПЕР ПОВЕРХ ДЕРЕВ */}
            <div
                className={`rocket-wrapper ${isLaunched ? "launching" : ""}`}
                onClick={handleLaunch}
            >
                <img
                    className="rocket"
                    src="https://stivs.dev/assets/rocket/rocket.svg"
                    alt="rocket"
                />

                <img
                    className="fire"
                    src="https://stivs.dev/assets/rocket/fire.svg"
                    alt="fire"
                />
            </div>

            <div id="grass">
                <div id="bug">🐞</div>
            </div>

            <css-doodle id="dood"></css-doodle>
        </div>
    );
}