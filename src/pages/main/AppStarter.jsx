import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header, Sidebar } from '../../components/layouts';

const AppStarter = () => {
  const userFromCookies = Cookies.get('user');
  const user = userFromCookies ? JSON.parse(userFromCookies) : null;

  const navigate = useNavigate();

  useEffect(() => {
      if(!user) {
        navigate('/auth/login')
      }
  }, [])

  return (
      <div className='w-full h-full bg-gray-100 flex'>
        <Sidebar />

        <div className='flex-1 h-screen flex flex-col'>
          <Header />
          <div className='h-[90vh] overflow-y-auto'>
            <Outlet />
          </div>
        </div>
      </div>
  )
}

export default AppStarter