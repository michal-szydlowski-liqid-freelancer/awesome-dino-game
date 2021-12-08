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

function App() {
  const gameWidth = window.innerWidth * 0.7;
  const gameHeight = window.innerHeight * 0.5;
  const dinoInitialYPosition = gameHeight - 50;
  const dinoInitialXPosition = 20;
  const cactusInitialPosition = gameWidth - 30;

  const timer = useRef(0);
  const [cactusPosition, setCactusPosition] = useState(cactusInitialPosition);

  const [dinoPosition, setDinoPosition] = useState({
    x: dinoInitialXPosition,
    y: dinoInitialYPosition,
  });
  const [isJumping, setIsJumping] = useState(false);

  const jump = () => {
    if (dinoPosition.y !== dinoInitialYPosition) {
      return;
    }

    setDinoPosition(({ x, y }) => {
      // if (y < gameHeight - 50 - 50 - 5) {
      //   return { x, y };
      // }
      console.log({ x, y });
      return { x, y: y - 10 };
    });
  };
  const interval = 50;

  const fallingTimer = useRef(0);

  const fallDown = () => {
    fallingTimer.current = setInterval(() => {
      setDinoPosition(({ x, y }) => {
        if (y + 50 >= gameHeight) {
          clearInterval(timer.current);
          clearInterval(fallingTimer.current);
          return { x, y: dinoInitialYPosition };
        }

        return { x, y: y + 10 };
      });
    }, interval);
  };

  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        fallDown();
      }
    });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        jump();
      }
    });
  }, []);

  // game loop

  useEffect(() => {
    timer.current = setInterval(() => {
      setCactusPosition((curr) => {
        if (curr <= 20 + 30) {
          clearInterval(timer.current);
          return curr;
        }

        return curr - 5;
      });
    }, interval);

    if (cactusPosition <= 0) {
      setCactusPosition(cactusInitialPosition);
    }
    fallDown();
    return () => clearInterval(timer.current);
  }, []);

  return (
    <div className="game">
      <Stage width={gameWidth} height={gameHeight}>
        <Layer>
          <Dino xPosition={dinoPosition.x} yPosition={dinoPosition.y} />
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
