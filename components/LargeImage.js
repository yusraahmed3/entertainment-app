import Image from "next/image";

export const LargeImage = ({ poster_path }) => {
  const src = `https://image.tmdb.org/t/p/original/${poster_path}`;
  return (
    <div className="relative w-52 h-72 md:w-96 md:h-110">
      <Image
        loader={() => src}
        src={src}
        unoptimized={true}
        layout="fill"
        alt="item poster"
        className=" rounded-lg"
      />
    </div>
  );
};
