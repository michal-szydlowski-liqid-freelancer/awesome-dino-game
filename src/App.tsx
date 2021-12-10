import StartScreen from './components/start-screen/StartScreen';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';

function getRandomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const gameWidth = window.innerWidth * 0.7;
const gameHeight = window.innerHeight * 0.5;
const dinoInitialYPosition = gameHeight - 50;
const dinoInitialXPosition = 20;
const dinoWidth = 30;
const dinoHeight = 50;
const maxJumpHeight = gameHeight - 50 - 50 - 50;
const cactusInitialPosition = gameWidth;
const gameSpeed = 5;
const jumpSpeed = 1;
let score = 0;

let currentDinoY = 0;
let isGameOver = false;
let isJumping = false;
let fired = false;
let isFalling = false;

const initialSpawnTimer = 200;

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
  const [image] = useImage('src/assets/louis.png');
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
  const [obstaclePositionArr, setObstaclePositionArr] = useState<Obstacle[]>(
    []
  );

  const [dinoPosition, setDinoPosition] = useState(dinoInitialYPosition);
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
      score++;
      // console.log({ isGameOver });
      // if (isGameOver) {
      //   setIsGameOver_global(true);
      //   return;
      // }

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
        setObstaclePositionArr((curr) => [...curr, spawnObstacle()]);
        if (obstaclePositionArr.length > 3) {
          setObstaclePositionArr((curr) => [
            curr[curr.length - 3],
            curr[curr.length - 2],
            curr[curr.length - 1],
          ]);
        }
        console.log(obstaclePositionArr);

        spawnTimer = initialSpawnTimer - gameSpeed;
      }

      setObstaclePositionArr((curr) => {
        return curr.map((obs) => {
          const isTouchingDino_right =
            obs.x <= dinoInitialXPosition + dinoWidth;

          const isTouchingDino_bottom =
            currentDinoY + dinoHeight <= gameHeight - obs.height;

          if (isTouchingDino_right && isTouchingDino_bottom) {
            console.log('colision');
            score = 0;
            isGameOver = true;
            return obs;
          }

          return { ...obs, x: obs.x - gameSpeed };
        });
      });

      window.requestAnimationFrame(gameLoop);
    }
  }, [isGameOver]);

  // const resetGame = () => {
  //   setIsGameOver_global(false);
  //   isGameOver = false;
  //   fired = false;
  // };

  return (
    <>
      <div className="game">
        <Stage width={gameWidth} height={gameHeight}>
          <Layer>
            <Text
              text={`SCORE: ${score}`}
              fontFamily={'Press Start 2P'}
              fontWeight="bolder"
              align="center"
              padding={20}
            />
            <Dino
              xPosition={dinoInitialXPosition}
              yPosition={dinoPosition}
              height={dinoHeight}
            />

            {obstaclePositionArr.map((obs) => {
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
      {/* <button onClick={resetGame}>reset</button> */}
    </>
  );
}

export default App;
