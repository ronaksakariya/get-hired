import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="w-full px-6 sm:px-10 lg:px-16 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <img
            src="/logo.png"
            alt="Hired Logo"
            className="h-14 sm:h-16 lg:h-20 w-auto"
          />
        </Link>

        <Link to="/login">
          <Button
            variant="outline"
            size="lg"
            className="border-gray-500 bg-transparent text-white hover:bg-white/10 hover:text-white cursor-pointer px-6 py-6 text-lg sm:text-xl"
          >
            Login
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
