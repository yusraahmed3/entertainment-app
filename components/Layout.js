
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";
import ToggleButton from "./ToggleTheme";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7F7FA] text-gray-900 transition-colors duration-300 dark:bg-[#101116] dark:text-white md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <Searchbar />
          </div>

          <div className="shrink-0">
            <ToggleButton />
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};

export default Layout;
