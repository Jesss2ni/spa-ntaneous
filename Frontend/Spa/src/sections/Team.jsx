import React from 'react';
import pic1 from '../assets/img/k.png';
import pic2 from '../assets/img/mai.png';
import pic3 from '../assets/img/neb.png';
import pic4 from '../assets/img/j2.png';
import pic5 from '../assets/img/j.png';

const Team = () => {
  return (
    <div className="bg-light dark py-12 border-8 flex justify-center items-center ">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 font-cursive text-dark">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          <div className="bg-dark p-6 rounded-lg shadow-md flex flex-col items-center transition duration-300 text-light ease-in-out transform hover:scale-105 hover:bg-gray-100 hover:text-black">
            <img className="w-48 h-48 mb-4 rounded-full" src={pic3} alt="John Nebrej N. Rempis" />
            <h3 className="text-xl font-semibold mb-2">John Nebrej N. Rempis</h3>
            <p className="">Project Manager</p>
          </div>
          <div className="bg-dark p-6 rounded-lg shadow-md flex flex-col items-center transition text-light duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 hover:text-black">
            <img className="w-48 h-48 mb-4 rounded-full" src={pic1} alt="Kenneth Espela" />
            <h3 className="text-xl font-semibold mb-2">Kenneth Espela</h3>
            <p className="">Finance Director</p>
          </div>
          <div className="bg-dark p-6 rounded-lg shadow-md flex flex-col items-center transition text-light duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 hover:text-black">
            <img className="w-48 h-48 mb-4 rounded-full" src={pic4} alt="Jestoni Vargas" />
            <h3 className="text-xl font-semibold mb-2">Jestoni Vargas</h3>
            <p className="">Developer</p>
          </div>
          <div className="bg-dark p-6 rounded-lg shadow-md flex flex-col items-center text-light transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 hover:text-black">
            <img className="w-48 h-48 mb-4 rounded-full" src={pic2} alt="Maidon Jeho Duran" />
            <h3 className="text-xl font-semibold mb-2">Maidon Jeho Duran</h3>
            <p className="">Marketing</p>
          </div>
          <div className="bg-dark p-6 rounded-lg shadow-md flex flex-col text-light items-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 hover:text-black">
            <img className="w-48 h-48 mb-4 rounded-full" src={pic5} alt="Julie Franz Imperial" />
            <h3 className="text-xl font-semibold mb-2">Julie Franz Imperial</h3>
            <p className="">Sales Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
