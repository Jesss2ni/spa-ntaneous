import React from 'react';
import bg from '../assets/img/room.jpg'
import bg1 from '../assets/img/candle.jpg'

const About = () => {

  return (
    
    <div className="flex flex-wrap justify-center w-full gap-12 p-4 mx-auto container ">

    <div className=' w-[30rem] flex items-center mt-4 mx-auto'>
    <div>
      <h1 className=' text-4xl mb-8 font-semibold font-cursive'>Welcome to Spa-ntaneous!</h1>
      <p className='text-normal leading-8 font-normal font-montserrat mb-9'> At Spa-ntaneous, we believe in the transformative power of relaxation and self-care. Our serene oasis awaits you, where stress melts away, and tranquility takes center stage</p>
    
      <div className=' flex justify-center'>
      <a href='/about' className='text-lg rounded-lg text-white  border-2 p-2 bg-dark hover:bg-light-dark duration-500 max-sm: w-auto relative'>Read More</a>
      </div>
    </div>
    </div>

    
    <div className="flex flex-wrap justify-center gap-4 mx-auto    ">

    <div className=' mx-auto flex flex-wrap justify-center gap-4'>
    <div className="w-[25rem] h-[25rem] max-sm:w-[15rem] max-sm:h-[20rem] bg-black hover:transform hover:scale-110 transition-transform duration-500 bg-center bg-cover rounded-[20px] border-2" style={{ backgroundImage: `url(${bg})`}}></div>
    </div>

    <div className=' mx-auto flex flex-wrap justify-center gap-4'>
    <div className="w-[25rem] h-[25rem] max-sm:w-[15rem] max-sm:h-[20rem] bg-black hover:transform hover:scale-110 transition-transform duration-500 bg-center bg-cover rounded-[20px] border-2" style={{ backgroundImage: `url(${bg1})`}}></div>
    </div>
    </div>
</div>
  
  
  
          
  );
};

export default About;
