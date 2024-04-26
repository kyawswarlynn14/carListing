import React from 'react';
import { IMAGES } from '../../constants'

const PageNotFound = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className="flex flex-col items-center">
        <img
          src={IMAGES.notFound}
          alt="Funny Photo"
          className="w-80 h-auto"
        />
        <h1 className="text-2xl font-bold">Oops! Page Not Found</h1>
        <p className="text-lg text-gray-600">Looks like the page you{"'"}re looking for is missing.</p>
      </div>
    </div>
  );
};

export default PageNotFound;