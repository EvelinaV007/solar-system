import { useEffect, useRef } from 'react';
import { planets, sunInfo } from '../data/solarSystemData';
import '../styles/SolarSystem.css';

export default function SolarSystem({ onRestart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const mouse = { x: -9999, y: -9999 };

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let scale = 1;
    let animationId;
    const startTime = performance.now();

    const angles = planets.map(() => Math.random() * Math.PI * 2);
    const moonAngles = planets.map((planet) =>
      (planet.moons || []).map(() => Math.random() * Math.PI * 2),
    );

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w / 2;
      cy = h / 2;
      scale = Math.min(w, h) / 800;
    };

    const gradientCircle = (x, y, r, c1, c2) => {
      const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r / 5, x, y, r);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const getPlanetPosition = (planet, index) => ({
      x: cx + Math.cos(angles[index]) * planet.orbit * scale,
      y: cy + Math.sin(angles[index]) * planet.orbit * scale,
    });

    const getHoverTarget = () => {
      let target = null;
      let closest = Infinity;
      const sunDistance = Math.hypot(mouse.x - cx, mouse.y - cy);

      if (sunDistance <= 34 * scale) {
        return {
          planet: sunInfo,
          pos: { x: cx, y: cy },
          isSun: true,
        };
      }

      planets.forEach((planet, index) => {
        const pos = getPlanetPosition(planet, index);
        const planetDistance = Math.hypot(mouse.x - pos.x, mouse.y - pos.y);
        const orbitDistance = Math.abs(
          Math.hypot(mouse.x - cx, mouse.y - cy) - planet.orbit * scale,
        );
        const planetHit = planetDistance <= Math.max(planet.r * scale + 8, 12);
        const orbitHit = orbitDistance <= 8;

        if ((planetHit || orbitHit) && orbitDistance < closest) {
          target = { planet, index, pos };
          closest = orbitDistance;
        }
      });

      return target;
    };

    const drawInfo = (target) => {
      const { planet, pos } = target;
      const boxW = 260;
      const boxH = 142;
      const x = Math.min(pos.x + 26, w - boxW - 16);
      const y = Math.max(16, Math.min(pos.y - 28, h - boxH - 16));

      ctx.fillStyle = 'rgba(0, 0, 0, 0.76)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y, boxW, boxH);
      ctx.strokeRect(x, y, boxW, boxH);

      ctx.fillStyle = '#f4f4f4';
      ctx.font = '700 21px Arial, sans-serif';
      ctx.fillText(planet.name.toUpperCase(), x + 12, y + 25);

      ctx.font = '13px Arial, sans-serif';
      const rows = [
        ['Mass:', planet.mass],
        ['Speed:', planet.orbitalSpeed],
        ['Circumference:', planet.circumference],
        ['Radius:', planet.radius],
        ['Escape velocity:', planet.escapeVelocity],
      ];

      rows.forEach(([label, value], row) => {
        const rowY = y + 48 + row * 17;
        ctx.fillStyle = '#d8d8d8';
        ctx.fillText(label, x + 12, rowY);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(value, x + 145, rowY);
      });
    };

    const drawMoons = (planet, planetIndex, pos) => {
      if (!planet.moons) return;

      planet.moons.forEach((moon, moonIndex) => {
        const orbit = moon.orbit * scale;
        const moonAngle = moonAngles[planetIndex][moonIndex];
        const moonX = pos.x + Math.cos(moonAngle) * orbit;
        const moonY = pos.y + Math.sin(moonAngle) * orbit;

        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, orbit, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        gradientCircle(moonX, moonY, Math.max(moon.r * scale, 1.2), moon.color, '#111');
        moonAngles[planetIndex][moonIndex] += moon.speed;
      });
    };

    const drawMiniRocket = (x, y, size, angle, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(size, size);
      ctx.globalAlpha = alpha;

      ctx.fillStyle = '#ff2756';
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.quadraticCurveTo(18, -20, 16, -5);
      ctx.lineTo(16, 20);
      ctx.lineTo(-16, 20);
      ctx.lineTo(-16, -5);
      ctx.quadraticCurveTo(-18, -20, 0, -30);
      ctx.fill();

      ctx.fillStyle = '#fff6ff';
      ctx.fillRect(-16, -3, 32, 23);

      ctx.fillStyle = '#2c0a6d';
      ctx.beginPath();
      ctx.arc(8, -4, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#7f72ff';
      ctx.beginPath();
      ctx.arc(9, -5, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2c0a6d';
      ctx.beginPath();
      ctx.moveTo(-16, 13);
      ctx.lineTo(-29, 28);
      ctx.lineTo(-14, 24);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(16, 13);
      ctx.lineTo(29, 28);
      ctx.lineTo(14, 24);
      ctx.fill();

      ctx.fillStyle = '#756174';
      ctx.fillRect(-9, 20, 18, 8);

      ctx.fillStyle = '#ff7b1a';
      ctx.beginPath();
      ctx.moveTo(-10, 28);
      ctx.quadraticCurveTo(0, 55, 10, 28);
      ctx.fill();

      ctx.restore();
    };

    const drawRocketArrival = (now) => {
      const elapsed = now - startTime;
      const arrivalDuration = 2800;
      const orbitStartAngle = -Math.PI * 0.2 + arrivalDuration * 0.0012;
      const outerOrbit = planets[planets.length - 1].orbit * scale;
      const orbitX = cx + Math.cos(orbitStartAngle) * outerOrbit;
      const orbitY = cy + Math.sin(orbitStartAngle) * outerOrbit;

      if (elapsed < arrivalDuration) {
        const t = elapsed / arrivalDuration;
        const ease = t;
        const startX = w * 0.5;
        const startY = h + 110;
        const x = startX + (orbitX - startX) * ease;
        const y = startY + (orbitY - startY) * ease;
        const size = 0.92 - ease * 0.48;
        const angle = Math.atan2(orbitX - startX, startY - orbitY);

        drawMiniRocket(x, y, size, angle, 1);
        return;
      }

      if (elapsed < 9600) {
        const orbitTime = elapsed - arrivalDuration;
        const fade = elapsed > 7600 ? 1 - (elapsed - 7600) / 2000 : 1;
        const angle = orbitStartAngle + orbitTime * 0.00075;
        const x = cx + Math.cos(angle) * outerOrbit;
        const y = cy + Math.sin(angle) * outerOrbit;

        drawMiniRocket(x, y, 0.44, angle + Math.PI, Math.max(0, fade));
      }
    };

    const render = (now) => {
      ctx.clearRect(0, 0, w, h);

      const hoverTarget = getHoverTarget();

      gradientCircle(cx, cy, 30 * scale, '#ffff66', '#ff9900');

      if (hoverTarget?.isSun) {
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 38 * scale, 0, Math.PI * 2);
        ctx.stroke();
      }

      planets.forEach((planet) => {
        const isHover = hoverTarget?.planet === planet;

        ctx.beginPath();
        ctx.arc(cx, cy, planet.orbit * scale, 0, Math.PI * 2);
        ctx.strokeStyle = isHover ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.16)';
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = isHover ? 2 : 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      planets.forEach((planet, index) => {
        const pos = getPlanetPosition(planet, index);

        if (planet.rings) {
          ctx.save();
          ctx.strokeStyle = 'rgba(218, 188, 146, 0.72)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(
            pos.x,
            pos.y,
            planet.r * scale * 1.8,
            planet.r * scale * 0.72,
            -0.35,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
          ctx.restore();
        }

        gradientCircle(pos.x, pos.y, planet.r * scale, planet.color, '#000');
        drawMoons(planet, index, pos);

        if (hoverTarget?.planet === planet) {
          ctx.strokeStyle = 'rgba(255,255,255,0.85)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, planet.r * scale + 7, 0, Math.PI * 2);
          ctx.stroke();
        }

        angles[index] += planet.speed;
      });

      if (hoverTarget) {
        drawInfo(hoverTarget);
      }

      drawRocketArrival(now);

      animationId = requestAnimationFrame(render);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    animationId = requestAnimationFrame(render);

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className='solar-system-screen'>
      <canvas ref={canvasRef} id='painting'></canvas>
      <button className='restart-button' type='button' onClick={onRestart}>
        start over
      </button>
    </div>
  );
}
