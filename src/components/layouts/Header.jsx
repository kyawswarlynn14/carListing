import React from 'react'
import UserDropdown from './UserDropdown'

const Header = () => {
  return (
    <div className='w-full h-[10vh] bg-white flex items-center justify-end px-6'>
        <UserDropdown />
    </div>
  )
}

export default Header