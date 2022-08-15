import Image from "next/image";

export const SliderImage = ({ poster_path }) => {
  const src = `https://image.tmdb.org/t/p/w220_and_h330_face/${poster_path}`;

  return (
    <div className="relative w-44 h-64 md:w-48 md:h-72">
      <Image
        loader={() => src}
        src={src}
        layout="fill"
        alt="show poster"
        className="object-cover rounded-lg"
        unoptimized={true}
      />
    </div>
  );
};
