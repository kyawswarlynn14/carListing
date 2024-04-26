import React from 'react'
import {IMAGES} from '../../constants';
import { Link } from 'react-router-dom';
import { FaGift } from "react-icons/fa";
import { RiComputerLine } from 'react-icons/ri'

const SIDEBAR_BUTTONS = [
  {
    title: "Administrators",
    link: "/app",
    icon: <RiComputerLine size={20} />,
  },
  {
    title: "Product",
    link: "/app/product",
    icon: <FaGift size={20} />,
  },
]

const Sidebar = () => {
  const pathname = window.location.pathname;

  return (
    <div className='w-[300px] h-screen overflow-y-auto bg-white border-r py-4 px-6'>
      <div className='w-full flex justify-center mt-4 mb-8'>
        <img src={IMAGES.logo} alt="logo" className='w-20 h-auto' />
      </div>

      <div>
        <h1 className='font-medium ml-4 mb-2'>NAVIGATION</h1>

        <div className='flex flex-col gap-1'>
          {SIDEBAR_BUTTONS.map(i => (
            <Link to={i?.link} key={i.title} className={`w-full rounded flex items-center gap-4 py-2 px-4 duration-300 ${pathname === i.link ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
              {i.icon}
              <span>{i.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar