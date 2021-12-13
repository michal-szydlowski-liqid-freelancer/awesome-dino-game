import './Character.css';

type TCharacter = {
  charName: string;
  isActive: boolean;
  prop: () => {};
};

const Character = ({ charName = 'puma', isActive, prop }: TCharacter) => {
  return (
    <div
      onClick={prop}
      className={`character-container ${isActive && 'active'}`}
    >
      <img src={`/src/assets/${charName}.png`} alt="" />
      <span>{charName}</span>
    </div>
  );
};

export default Character;
