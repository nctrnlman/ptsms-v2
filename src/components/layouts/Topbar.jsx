import { useState } from "react";
import logo from "../../assets/logo/icon-dark.png";
import ava from "../../assets/profile/ava.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Topbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.User);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSidebarToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    toggleSidebar();
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user_token");
    toast.success("Logout success");
    closeDropdown();
    navigate("/login");
  };

  return (
    <nav className="relative top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              type="button"
              onClick={handleSidebarToggle}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <div className={`hamburger ${isMenuOpen ? "" : "open"}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            <a className="flex ms-2 md:me-24">
              <img src={logo} className="h-11 me-3" alt="Company Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Codenito
              </span>
            </a>
          </div>
          <div className="flex items-center relative">
            <div className="flex items-center ms-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                  // onBlur={closeDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={ava}
                    alt="user photo"
                  />
                </button>
              </div>
              {isDropdownOpen && (
                <div
                  className="z-50 absolute right-0 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                  style={{ top: "100%" }}
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      {userData.name}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      {userData.email}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <ul className="py-1" role="none">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white hover:cursor-pointer"
                            role="menuitem"
                            onClick={handleSignOut}
                          >
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
