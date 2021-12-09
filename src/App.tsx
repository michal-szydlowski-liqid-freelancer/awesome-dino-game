import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

const gameWidth = window.innerWidth * 0.7;
const gameHeight = window.innerHeight * 0.5;
const dinoInitialYPosition = gameHeight - 50;
const dinoInitialXPosition = 20;
const dinoWidth = 30;
const dinoHeight = 50;
const maxJumpHeight = gameHeight - 50 - 50 - 100;
const cactusInitialPosition = gameWidth;

let currentDinoY = 0;
let isGameOver = false;
let isJumping = false;
let fired = false;

function Dino({
  xPosition,
  yPosition,
  height,
}: {
  xPosition: number;
  yPosition: number;
  height: number;
}) {
  return (
    <Rect x={xPosition} y={yPosition} width={30} height={height} fill="blue" />
  );
}

function App() {
  const [cactusPosition, setCactusPosition] = useState(cactusInitialPosition);

  const [dinoPosition, setDinoPosition] = useState(dinoInitialYPosition);
  const [isGameOver_global, setIsGameOver_global] = useState(false);
  useEffect(() => {
    window.requestAnimationFrame(gameLoop);
    // 60 fps

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
      console.log({ isGameOver });
      if (isGameOver) {
        setIsGameOver_global(true);
        return;
      }

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
          currentDinoY = current - 5;
          return current - 5;
        }

        if (isDinoOnTheGround) {
          currentDinoY = dinoInitialYPosition;
          return dinoInitialYPosition;
        }
        currentDinoY = current + 5;
        return current + 5;
      });

      setCactusPosition((current) => {
        const isTouchingDino_right =
          current <= dinoInitialXPosition + dinoWidth;

        const isTouchingDino_bottom =
          currentDinoY + dinoHeight >= gameHeight - dinoHeight;

        if (isTouchingDino_right && isTouchingDino_bottom) {
          isGameOver = true;
          return current;
        }

        if (current <= 0) {
          return gameWidth;
        }
        return current - 5;
      });

      window.requestAnimationFrame(gameLoop);
    }
  }, [isGameOver]);

  const resetGame = () => {
    setIsGameOver_global(false);
    isGameOver = false;
    fired = false;
  };
  return (
    <>
      <div className="game">
        {console.log({ isGameOver_global })}
        <Stage width={gameWidth} height={gameHeight}>
          <Layer>
            <Dino
              xPosition={dinoInitialXPosition}
              yPosition={dinoPosition}
              height={dinoHeight}
            />
            <Rect
              x={cactusPosition}
              y={gameHeight - 50}
              width={dinoWidth}
              height={50}
              fill="green"
            />
          </Layer>
        </Stage>
      </div>
      <button onClick={resetGame}>reset</button>
    </>
  );
}

export default App;
