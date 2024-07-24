import React, { useState } from 'react';
import image1 from '../assets/img/H-1.jpg';
import image2 from '../assets/img/H-2.jpg';
import image3 from '../assets/img/H-3.jpg';
import left from '../assets/img/left.png';
import right from '../assets/img/right.png';

function Hero() {
  const slides = [image1, image2, image3];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  return (
    <section
      id="home"
      className="relative w-full  flex sm:flex-row  justify-center max-container "
    >
      <div className="relative max-w-[1400px] h-[780px] w-full py-16 px-4  ">
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              backgroundImage: `url(${slide})`,
              width: '100%',
              height: '100%',
              borderRadius: '20px',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              transition: 'opacity 0.5s ease-in-out', 
              opacity: index === currentSlide ? 1 : 0, 
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            className="w-full h-full rounded-2xl duration-500"
          />
        ))}

        <div
          className="absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full p-2  text-white cursor-pointer bg-light z-10 hover:bg-light-dark transition duration-300"
          onClick={prevSlide}
        >
          <img width={20} src={left} alt="Previous Slide" />
        </div>

        <div
          className="absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full p-2  text-white cursor-pointer z-10 bg-light  hover:bg-light-dark transition duration-300"
          onClick={nextSlide}
        >
          <img width={20} src={right} alt="Next Slide" />
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 text-white text-center mx-auto bg-dark rounded-md p-12" style={{opacity: 0.8}}>
          <h1 className="text-lg max-md:text-sm font-normal  text-light font-palanquin mb-3"> Welcome to</h1>
          <h1 className="text-[60px] max-md:text-[20px]  max-lg:text-[25px] tracking-[10px]  mb-5   font-light  text-light font-palanquin">Spa-ntaneous</h1>
          <p className="text-lg font-normal max-md:text-[10px] max-lg:text-[10px] text-light font-palanquin">Where relaxation meets adventure!</p>
          <a href='/services'>
          <button className='text-xl mt-9  rounded-md border-light border-2 p-2 bg-dark hover:bg-light-dark duration-500 max-sm: w-auto relative'>Services </button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;

