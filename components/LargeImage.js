import Image from "next/image";

export const LargeImage = ({ poster_path }) => {
  const src = `https://image.tmdb.org/t/p/original/${poster_path}`;
  return (
    <div className="relative w-52 h-72 md:w-64 md:h-80 lg:w-96 lg:h-110">
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
