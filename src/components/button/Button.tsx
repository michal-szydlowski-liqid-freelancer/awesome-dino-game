import './Button.css';

type TButton = {
  text: string;
  onClick: () => void;
};

const Button = ({ text, onClick }: TButton) => {
  return (
    <button className="button-container" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
