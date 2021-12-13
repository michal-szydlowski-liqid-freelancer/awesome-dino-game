import './Character.css';
import louis from '../../images/louis.png';
import puma from '../../images/puma.png';
import michal from '../../images/michal.png';

type TCharacter = {
  charName: string;
  isActive: boolean;
  prop: () => void;
};

const Character = ({ charName = 'puma', isActive, prop }: TCharacter) => {
  const images: Record<string, string> = {
    louis,
    puma,
    michal,
  };

  return (
    <div
      onClick={prop}
      className={`character-container ${isActive && 'active'}`}
    >
      <img src={images[charName]} alt="" />
      <span>{charName}</span>
    </div>
  );
};

export default Character;
