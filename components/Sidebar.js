
import {
  FiHome,
  FiFilm,
  FiTv,
  FiHeart,
  FiBookmark,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  const navigation = [
    { name: "Home", icon: FiHome, href: "/" },
    { name: "Movies", icon: FiFilm, href: "/movies" },
    { name: "TV Shows", icon: FiTv, href: "/shows" },
  ];

  const library = [
    { name: "Favorites", icon: FiHeart, href: "/favorites" },
    { name: "Watchlist", icon: FiBookmark, href: "/saved" },
  ];

  const isActive = (href) =>
    router.pathname === href ||
    (href !== "/" &&
      router.pathname.startsWith(href + "/"));

  const NavItem = ({ name, icon: Icon, href }) => (
    <Link href={href}>
      <a
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive(href)
            ? "bg-[#A78BFA]/15 text-[#B69AFF]"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
        }`}
      >
        <Icon className="text-lg" />
        <span className="hidden md:inline">{name}</span>
      </a>
    </Link>
  );

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white dark:border-white/10 dark:bg-[#151620] md:min-h-screen md:w-[230px] md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-5 md:px-6 md:py-8">
        <Link href="/">
          <a className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A78BFA] text-[#151620]">
              <FiFilm />
            </span>
            <span className="hidden sm:inline">
              Cine<span className="text-[#A78BFA]">Hub</span>
            </span>
          </a>
        </Link>

        <span className="text-xs text-gray-400 md:hidden">
          Discover movies
        </span>
      </div>

      <div className="hidden flex-1 flex-col px-3 pb-6 md:flex">
        <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
          Discover
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="mt-9">
          <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Your Library
          </p>

          <nav className="space-y-1">
            {library.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-gray-200 px-4 pt-5 text-xs leading-5 text-gray-400 dark:border-white/10">
          Your personal movie collection
        </div>
      </div>

      <nav className="flex items-center justify-around border-t border-gray-200 px-2 pb-3 dark:border-white/10 md:hidden">
        {[...navigation, ...library].map(
          ({ name, icon: Icon, href }) => (
            <Link href={href} key={href}>
              <a
                className={`flex flex-col items-center gap-1 px-2 py-2 text-[10px] ${
                  isActive(href)
                    ? "text-[#A78BFA]"
                    : "text-gray-400"
                }`}
              >
                <Icon className="text-xl" />
                {name}
              </a>
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}
