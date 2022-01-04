import React from 'react';
import Link from 'next/link';

const Home: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col space-y-3 items-center justify-center px-6 py-10 max-w-screen">
      <p className="p-10 max-w-2xl bg-white border-2 border-gray-200 rounded">
        420 DAO is a going to be a set of fun tools for all our frens to play around on the blockchain. Right now
        everything is on Polygon so you can play without breaking the bank. Let's just break some stuff and see what
        happens xoxoxo. Also! if you learn something cool please pay it forward and teach someone else - in this way we
        can share all our new token powers.
      </p>
      <p className="pl-2 pt-2 max-w-2xl rounded w-full text-xl">Project List</p>
      <div className="border border-b border-gray-200 w-full max-w-2xl" />
      <Link href="/factory">
        <div className="flex flex-col space-y-2 p-10 items-start justify-center max-w-2xl bg-white shadow-lg rounded-lg border-2 border-gray-200 w-full hover:shadow-xl cursor-pointer">
          <div className="flex items-center">
            🏭
            <span className="hidden h-auto pl-3 text-xl font-bold text-black cursor-pointer lg:block align-cente">
              Token Factory
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Home;
