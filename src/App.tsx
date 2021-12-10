import StartScreen from './components/start-screen/StartScreen';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';

const gameWidth = window.innerWidth * 0.7;
const gameHeight = window.innerHeight * 0.5;
const dinoInitialYPosition = gameHeight - 50;
const dinoInitialXPosition = 20;
const dinoWidth = 30;
const dinoHeight = 50;
const maxJumpHeight = gameHeight - 50 - 50 - 40;
const cactusInitialPosition = gameWidth;
let gameSpeed = 7;
let jumpSpeed = 6;
let score = 0;

let currentDinoY = 0;
let isGameOver = false;
let isJumping = false;
let fired = false;
let isFalling = false;

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

      setCactusPosition((current) => {
        const isTouchingDino_right =
          current <= dinoInitialXPosition + dinoWidth;

        const isTouchingDino_bottom =
          currentDinoY + dinoHeight >= gameHeight - dinoHeight;

        //   // console.log(currentDinoY);

        if (isTouchingDino_right && isTouchingDino_bottom) {
          console.log('colision');
          score = 0;
          isGameOver = true;
          return current;
        }

        if (current <= 0) {
          return gameWidth;
        }
        return current - gameSpeed;
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
        {/* {console.log({ isGameOver_global })} */}
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
            <Potato
              xPosition={cactusPosition}
              yPosition={gameHeight - 50}
              width={dinoWidth}
              height={50}
            />
          </Layer>
        </Stage>
      </div>
      {/* <button onClick={resetGame}>reset</button> */}
    </>
  );
}

export default App;
