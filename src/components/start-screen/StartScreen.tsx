import { useState } from 'react';
import Button from '../button/Button';
import Character from '../character/Character';
import './StartScreen.css';

function StartScreen({ startGame }) {
  const [selectedChar, setSelectedChar] = useState('michał');
  const chars = ['puma', 'louis', 'michał'];
  return (
    <div className="start-screen-container">
      <h1>Le Dinossaur Game</h1>
      <Button text="Start Game" onClick={() => startGame(selectedChar)} />
      <span>Choose Character:</span>
      <div className="chars-container">
        {chars.map((char) => (
          <Character
            key={char}
            charName={`${char}`}
            isActive={selectedChar === char}
            prop={() => setSelectedChar(char)}
          />
        ))}
      </div>
    </div>
  );
}

export default StartScreen;
