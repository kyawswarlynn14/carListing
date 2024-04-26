import Cookies from 'js-cookie';
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

const AuthStarter = () => {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            navigate('/app')
        }
    }, [])

    return (
        <div className='w-full min-h-screen bg-slate-100 flex items-center justify-center'>
            <div className='w-[95%] sm:w-[400px] h-max mx-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default AuthStarter;