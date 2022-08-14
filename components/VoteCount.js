import { BsStarFill } from "react-icons/bs";

export const VoteCount = ({ vote }) => {
  return (
    <div className="flex items-center space-x-2">
      <p>
        <BsStarFill />
      </p>
      <p>{vote.toFixed(1)}</p>
    </div>
  );
};
