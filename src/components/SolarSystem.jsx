import React, { useEffect, useRef } from "react";
import "../styles/SolarSystem.css";

export default function SolarSystem() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        const cx = w / 2;
        const cy = h / 2;
        const scale = Math.min(w, h) / 800;

        const planets = [
            { r: 4 * scale, orbit: 40 * scale, speed: 0.02, color: "#b3b3b3" },
            { r: 7 * scale, orbit: 70 * scale, speed: 0.015, color: "#fbe0a1" },
            { r: 8 * scale, orbit: 100 * scale, speed: 0.013, color: "#3a82ff" },
            { r: 6 * scale, orbit: 140 * scale, speed: 0.010, color: "#f05c3c" },
            { r: 15 * scale, orbit: 200 * scale, speed: 0.007, color: "#c2a97b" },
            { r: 13 * scale, orbit: 260 * scale, speed: 0.005, color: "#dabc92" },
            { r: 10 * scale, orbit: 320 * scale, speed: 0.004, color: "#7cd3e7" },
            { r: 9 * scale, orbit: 370 * scale, speed: 0.003, color: "#4974e6" },
            { r: 3 * scale, orbit: 410 * scale, speed: 0.002, color: "#8a715d" }
        ];
        const sunR = 30 * scale;
        let a = planets.map(() => Math.random() * Math.PI * 2);

        const gradientCircle = (x, y, r, c1, c2) => {
            const g = ctx.createRadialGradient(x, y, r / 5, x, y, r);
            g.addColorStop(0, c1);
            g.addColorStop(1, c2);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        };

        const render = () => {
            ctx.clearRect(0, 0, w, h);
            gradientCircle(cx, cy, sunR, "#ffff66", "#ff9900");
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            planets.forEach(p => {
                ctx.beginPath(); ctx.arc(cx, cy, p.orbit, 0, Math.PI * 2); ctx.stroke();
            });
            planets.forEach((p, i) => {
                const x = cx + Math.cos(a[i]) * p.orbit;
                const y = cy + Math.sin(a[i]) * p.orbit;
                gradientCircle(x, y, p.r, p.color, "#000");
                a[i] += p.speed;
            });
            requestAnimationFrame(render);
        };
        render();

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return <canvas ref={canvasRef} id="painting"></canvas>;
}
