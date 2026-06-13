import { useEffect, useState } from 'react';
import '../styles/Meadow.css';
import 'css-doodle';

export default function Meadow({ onNext }) {
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const dood = document.getElementById('dood');
    const forest = document.getElementById('forest');

    function getCss(gridSize) {
      return `
      :doodle {
        @grid:${gridSize}/100%;
        width:100vw;
        height:100vh;
      }

      :after {
        content:@p("*");
        color:@p(#ff477e, #7c5cff, #35d18f, #ff9f1c);
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
          transform: translateX(@r(-20px,20px)) translateY(@r(-20px,20px));
        }

        50% {
          transform: translateX(@r(-200px,200px)) translateY(@r(-300px,-100px));
        }

        100% {
          transform: translateY(-100vh);
        }
      }
      `;
    }

    function generateTree(height, position) {
      const template = `
        <div class="tree__5"></div>
        <div class="tree__1"></div>
        <div class="tree__2"></div>
        <div class="tree__3"></div>
        <div class="tree__4" style="height:${height}px"></div>
      `;

      const el = document.createElement('div');

      el.className = 'tree';
      el.style.left = `${position}%`;
      el.innerHTML = template;

      return el;
    }

    function initForest() {
      forest.innerHTML = '';

      const density = Math.floor(window.innerWidth / 10);

      for (let i = 0; i < density; i++) {
        const pos = Math.random() * 120 - 20;
        const hei = Math.floor(Math.random() * 250) + 50;

        forest.appendChild(generateTree(hei, pos));
      }

      dood.update(getCss(15));
    }

    initForest();
    window.addEventListener('resize', initForest);

    return () => {
      window.removeEventListener('resize', initForest);
    };
  }, []);

  const handleLaunch = () => {
    if (isLaunched) return;

    setIsLaunched(true);

    setTimeout(() => {
      if (onNext) onNext();
    }, 5800);
  };

  return (
    <div className={`scene ${isLaunched ? 'launching-scene' : ''}`}>
      <div className='sky-sweep'></div>
      <div className='meadow-stars'></div>
      <div id='sun' aria-hidden='true'></div>
      <div id='moon' aria-hidden='true'></div>

      <div id='forest'></div>

      <div
        className={`rocket-wrapper ${isLaunched ? 'launching' : ''}`}
        onClick={handleLaunch}
        role='button'
        aria-label='Launch rocket'
      >
        <div className='rocket-hint'>Click the rocket to fly into space!</div>
        <div className='rocket'>
          <div className='rocket-nose'></div>
          <div className='rocket-body'></div>
          <div className='rocket-window'></div>
          <div className='rocket-fin rocket-fin-left'></div>
          <div className='rocket-fin rocket-fin-right'></div>
          <div className='rocket-nozzle'></div>
        </div>
        <div className='fire'>
          <span></span>
        </div>
        <div className='smoke smoke-one'></div>
        <div className='smoke smoke-two'></div>
        <div className='smoke smoke-three'></div>
      </div>

      <div id='grass'>
        <div id='bug'></div>
      </div>

      <css-doodle id='dood'></css-doodle>
    </div>
  );
}
