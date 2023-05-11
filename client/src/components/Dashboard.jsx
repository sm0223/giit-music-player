import React from 'react';
import Header from "./Header";

const Dashboard = () => {
  return (
      <div className='w-full h-auto flex flex-col items-center justify-center bg-green-500'>
        <Header/>
        <div className='w-[60%] bg-amber-50'>
          Hello
        </div>
      </div>
  );
};

export default Dashboard;
