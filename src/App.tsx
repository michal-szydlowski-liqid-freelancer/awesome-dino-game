import StartScreen from './components/start-screen/StartScreen';
import './App.css';
import { useEffect, useState } from 'react';
import { Stage, Layer, Text, Image, Rect } from 'react-konva';
import useImage from 'use-image';

function getRandomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const gameWidth = window.innerWidth * 0.9 > 450 ? 450 : window.innerWidth * 0.9;
const gameHeight = 200;
const dinoInitialYPosition = gameHeight - 50;
const dinoInitialXPosition = 20;
const dinoWidth = 30;
const dinoHeight = 50;
const maxJumpHeight = gameHeight - 50 - 50 - 50;
const cactusInitialPosition = gameWidth;
const gameSpeed = 6;
const jumpSpeed = 4;

let score = 0;
let currentDinoY = 0;
let isGameOver = false;
let isJumping = false;
let fired = false;
let isFalling = false;

let initialSpawnTimer = 200;

let spawnTimer = initialSpawnTimer;

type Obstacle = { height: number; width: number; x: number };

function Dino({
  xPosition,
  yPosition,
  height,
}: {
  xPosition: number;
  yPosition: number;
  height: number;
}) {
  const [image] = useImage('src/assets/puma.png');
  return (
    <Image
      image={image}
      x={xPosition}
      y={yPosition}
      width={30}
      height={height}
    />
  );
}

function Potato({
  xPosition,
  yPosition,
  height,
  width,
}: {
  xPosition: number;
  yPosition: number;
  height: number;
  width: number;
}) {
  const [image] = useImage('src/assets/angry_potato_adobespark.png');
  return (
    <Image
      image={image}
      x={xPosition}
      y={yPosition}
      width={width + 10}
      height={height}
    />
  );
}
const spawnObstacle = () => {
  const height = getRandomInRange(30, 50);
  const width = getRandomInRange(15, 30);
  const newObs = { height, width, x: cactusInitialPosition };

  return newObs;
};

function App() {
  const [obstacleArray, setObstacleArr] = useState<Obstacle[]>([]);
  const [dinoPosition, setDinoPosition] = useState(dinoInitialYPosition);
  const [gameOverGlobal, setGameOverGlobal] = useState(false);

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
      if (isGameOver) {
        setGameOverGlobal(true);
        return;
      }

      score++;

      // DINO moving part
      setDinoPosition((current) => {
        const isDinoOnTheGround = current === dinoInitialYPosition;
        const isMaxReached = current <= maxJumpHeight;

        // PREVENTS DINO FROM JUMPING HIGHER THEN THE LIMIT
        if (isMaxReached) {
          console.log('HIT MAX');

          isJumping = false;
        }

        if (isDinoOnTheGround) {
          fired = false;
          isFalling = false;
        }

        // JUMP - INCRESE 1PX TO THE JUMP
        if (isJumping && !isFalling) {
          isFalling = false;
          currentDinoY = current - jumpSpeed;
          return current - jumpSpeed;
        }

        // STOP THE FALL WHEN THE DINO HITS THE GROUND
        if (isDinoOnTheGround) {
          currentDinoY = dinoInitialYPosition;
          isFalling = false;
          return dinoInitialYPosition;
        }

        // FALL - INCRESE 1PX TO THE FALL
        isFalling = true;
        currentDinoY = current + jumpSpeed;
        return current + jumpSpeed;
      });

      spawnTimer--;

      if (spawnTimer <= 0 && !isGameOver) {
        setObstacleArr((curr) => [...curr, spawnObstacle()]);

        console.log(obstacleArray);

        // spawnTimer = initialSpawnTimer - gameSpeed;
        spawnTimer = initialSpawnTimer;
      }

      setObstacleArr((curr) => {
        const currentObstaclesArray = [...curr];

        currentObstaclesArray.forEach((obstacle) => {
          obstacle.x = obstacle.x - 2;
        });

        currentObstaclesArray.forEach((obstacle, index) => {
          const hasLeftTheScreen = obstacle.x + obstacle.width <= 0;

          if (hasLeftTheScreen) {
            currentObstaclesArray.splice(index, 1);
          }

          const isTouchingDino_right =
            obstacle.x <= dinoInitialXPosition + dinoWidth;

          const dinoYPos = currentDinoY + dinoHeight;
          const isTouchingDino_bottom =
            dinoYPos >= gameHeight - obstacle.height;

          if (isTouchingDino_bottom && isTouchingDino_right) {
            isGameOver = true;
            return obstacle;
          }

          return { ...obstacle, x: obstacle.x - gameSpeed };
        });

        return currentObstaclesArray;
      });

      window.requestAnimationFrame(gameLoop);
    }
  }, [gameOverGlobal]);

  const resetGame = () => {
    setGameOverGlobal(false);
    setObstacleArr([]);
    score = 0;
    isGameOver = false;
    fired = false;
  };

  return (
    <>
      <div className="game">
        <Stage width={gameWidth} height={gameHeight}>
          <Layer>
            <Text
              y={15}
              x={15}
              text={`SCORE: ${score}`}
              fontFamily={'Press Start 2P'}
              fontWeight="bolder"
              align="center"
            />
            {isGameOver && (
              <>
                <Text
                  y={75}
                  width={gameWidth}
                  text={`Game Over, you suck! :(`}
                  fontFamily={'Press Start 2P'}
                  fontWeight="bolder"
                  align="center"
                />
                <Rect
                  x={gameWidth / 2 - 35}
                  y={100}
                  width={70}
                  height={20}
                  stroke="#000"
                  strokeWidth={2}
                  shadowColor="black"
                  shadowBlur={3}
                  shadowOffsetX={2}
                  shadowOffsetY={2}
                  shadowOpacity={0.3}
                  fill={'transparent'}
                  onClick={resetGame}
                />
                <Text
                  x={gameWidth / 2 - 35}
                  y={100}
                  text={`RESET`}
                  fontFamily={'Press Start 2P'}
                  fontWeight="bolder"
                  align="center"
                  padding={5}
                  onClick={resetGame}
                />
              </>
            )}
            <Dino
              xPosition={dinoInitialXPosition}
              yPosition={dinoPosition}
              height={dinoHeight}
            />
            {obstacleArray.map((obs) => {
              return (
                <Potato
                  xPosition={obs.x}
                  yPosition={gameHeight - obs.height}
                  width={obs.width}
                  height={obs.height}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default App;
