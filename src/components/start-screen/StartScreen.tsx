import { useState } from 'react';
import Button from '../button/Button';
import Character from '../character/Character';
import './StartScreen.css';

function StartScreen() {
  const [showCharacters, setShowCharacters] = useState(false);
  return (
    <div className="start-screen-container">
      <h1>Le Dinossaur Game</h1>
      <Button text="Start Game" onClick={() => {}} />
      <Button text="Choose Character" onClick={() => {}} />
      <Character />
    </div>
  );
}

export default StartScreen;
