export const Message = ({ message, error }) => {
  return (
    <div
      className={`${
        error ? "bg-red-600" : "bg-green-600"
      } text-white w-1/4 p-3 rounded-md text-center`}
    >
      {message}
    </div>
  );
};
