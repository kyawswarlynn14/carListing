import React from 'react';
import { IMAGES } from '../../constants'

const NotAuthorized = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className="flex flex-col items-center">
        <img
          src={IMAGES.notAuthorized}
          alt="Funny Photo"
          className="w-80 h-auto"
        />
        <h1 className="text-2xl font-bold">You're not authorized!</h1>
      </div>
    </div>
  );
};

export default NotAuthorized;