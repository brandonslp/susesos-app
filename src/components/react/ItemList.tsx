


export interface Props {
  text: string
}

const Card = ({ text }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-2">
      <p>{text}</p>
    </div>
  );
};

export default Card;
