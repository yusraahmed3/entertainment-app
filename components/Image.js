import Image from "next/image";

export const ImageComponent = ({ poster_path }) => {
  const src = `https://image.tmdb.org/t/p/original/${poster_path}`;

  return (
    <Image
      loader={() => src}
      src={src}
      unoptimized={true}
      layout="fill"
      alt="show poster"
      className="rounded-md"
    />
  );
};
