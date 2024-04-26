import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../constants";

import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../../store/auth/authSlice";

function UserDropdown() {
  const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    dispatch(userLoggedOut());
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="w-fit h-fit relative z-50">
      <div
        className="menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className='flex items-center gap-2'>
            <h1>{user?.email}</h1>
            <img src={IMAGES.user} alt="user" className='w-10 h-10 cursor-pointer rounded-full object-cover' />
        </button>

        {isDropdownVisible && (
          <div className="absolute top-8 right-0 w-fit pt-4">
            <div className="w-fit h-fit shadow-lg border bg-white flex flex-col rounded-lg overflow-hidden">
              <div>
                <p className="font-medium p-2 text-center">{user?.firstName} {user?.lastName}</p>
              </div>

              <button onClick={handleLogout} className="LDropdownButton">
                  <FiLogOut size={20} />
                  <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDropdown;