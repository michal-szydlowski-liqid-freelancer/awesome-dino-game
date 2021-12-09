import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

function Dino({
  xPosition,
  yPosition,
}: {
  xPosition: number;
  yPosition: number;
}) {
  return (
    <Rect x={xPosition} y={yPosition} width={30} height={50} fill="blue" />
  );
}
const gameWidth = window.innerWidth * 0.7;
const gameHeight = window.innerHeight * 0.5;
const dinoInitialYPosition = gameHeight - 50;
const dinoInitialXPosition = 20;
const maxJumpHeight = gameHeight - 50 - 50 - 20;
const cactusInitialPosition = 20 + 30 + 2;

function App() {
  const [cactusPosition, setCactusPosition] = useState(cactusInitialPosition);

  const [dinoPosition, setDinoPosition] = useState(dinoInitialYPosition);

  useEffect(() => {
    window.requestAnimationFrame(gameLoop);
    // 60 fps
    let isJumping = false;
    let fired = false;
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        if (!fired) {
          fired = true;
          isJumping = true;
        }
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        fired = false;
      }
    });

    function gameLoop() {
      // DINO moving part
      setDinoPosition((current) => {
        const isDinoOnTheGround = current === dinoInitialYPosition;
        const isMaxReached = current <= maxJumpHeight;

        if (isMaxReached) {
          isJumping = false;
        }

        if (isDinoOnTheGround) {
          fired = false;
        }

        if (isJumping) {
          return current - 5;
        }

        if (isDinoOnTheGround) {
          return dinoInitialYPosition;
        }

        return current + 5;
      });

      window.requestAnimationFrame(gameLoop);
    }
  }, []);

  return (
    <div className="game">
      <Stage width={gameWidth} height={gameHeight}>
        <Layer>
          <Dino xPosition={dinoInitialXPosition} yPosition={dinoPosition} />
          <Rect
            x={cactusPosition}
            y={gameHeight - 50}
            width={30}
            height={50}
            fill="green"
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
