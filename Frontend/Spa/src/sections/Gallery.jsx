import React from 'react';
import g1 from '../assets/img/g-1.jpg';
import g2 from '../assets/img/g-2.jpg';
import g3 from '../assets/img/g-3.jpg';
import g4 from '../assets/img/g-4.jpg';
import g5 from '../assets/img/g-5.jpg';
import g6 from '../assets/img/g-6.jpg';

const Gallery = () => {
  return (
    <div className="container mx-auto">
 
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" >
    <img src={g1} alt="Image 1" className="w-full h-[30rem] object-cover rounded-full shadow-2xl shadow-black transform transition-transform hover:scale-110" />
    <img src={g2} alt="Image 2" className="w-full h-[30rem] object-cover rounded-lg shadow-2xl shadow-black transform transition-transform hover:scale-110" />
    <img src={g3} alt="Image 3" className="w-full h-[30rem] object-cover rounded-full shadow-2xl shadow-black transform transition-transform hover:scale-110" />
    <img src={g4} alt="Image 4" className="w-full h-[30rem] object-cover rounded-lg shadow-xl shadow-black transform transition-transform hover:scale-110" />
    <img src={g5} alt="Image 5" className="w-full h-[30rem] object-cover rounded-full shadow-2xl shadow-black transform transition-transform hover:scale-110" />
    <img src={g6} alt="Image 6" className="w-full h-[30rem] object-cover rounded-lg shadow-2xl shadow-black transform transition-transform hover:scale-110" />
  </div>
</div>

  );
};

export default Gallery;
