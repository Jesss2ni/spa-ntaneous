import {useEffect, useState} from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi'; 
import { animateScroll as scroll } from 'react-scroll'; 
import Nav from '../components/Nav'
import Footer from '../sections/Footer'
import bg from '../assets/img/back.jpg'
import bg1 from '../assets/img/room.jpg'
import bg2 from '../assets/img/candle.jpg'
import bg3 from '../assets/img/white.jpg'
import bg4 from '../assets/img/spa.jpg'
import Gallery  from '../sections/Gallery';


const Aboutpage = () => {

  useEffect(() => {
   document.title = 'About - Spa-ntaneous'
  },[])

  const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 400) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener('scroll', toggleVisibility);
  
      return () => {
        window.removeEventListener('scroll', toggleVisibility);
      };
    }, []);
  
    const scrollToTop = () => {
      scroll.scrollToTop({
        duration: 500, 
      });
    };
  
    return (
      <button
      className={`fixed right-4 bottom-12 z-50 bg-dark hover:bg-light-dark text-white rounded-xl p-3 ${isVisible ? 'opacity-100 transition-opacity duration-300 animate-bounce' : 'opacity-0 transition-opacity duration-300'}`}
      onClick={scrollToTop}
    >
      <HiOutlineArrowUp className="w-5 h-12" />
    </button>
    
    );
  };

  return (
    <main className='relative' >

      <section>
        <Nav />
      </section>

      <header className=" mx-auto h-[20rem]  flex justify-center items-center bg-center bg-cover border-b-8 border-dark" style={{backgroundImage: `url(${bg})`}}>

        <div className="">          
          <h1 className='text-[6rem] text-dark font-extrabold font-palanquin text-center'>About Us</h1>
          <h1 className='text-center tracking-widest bg-dark p-2 text-light '><a className='mr-2 hover:text-light-dark transition-colors duration-200 hover:underline ' href='/'><span>Home</span></a>/<span className='ml-2'>About</span></h1>
        </div>
      </header>

    
      <section className='mx-auto'style={{backgroundImage: `url(${bg3})`}}>

        <div className="flex flex-wrap container justify-center  w-full gap-12 p-4 mx-auto " >

          <div className=' w-[35rem] bg-white p-9  rounded-lg'>
            <div>
              <h1 className=' text-4xl mb-8 font-semibold font-cursive text-light-dark'> Welcome to Spa-ntaneous</h1>
                <p className='text-normal leading-8 font-normal font-montserrat mb-9'> Discover a haven of rejuvenation, where skilled therapists pamper your senses with soothing massages, invigorating facials, and holistic treatments. Whether you seek solace from a busy day or simply want to indulge, Spa-ntaneous is your sanctuary.</p>
            </div>
          </div>

          <div className=' text-center  w-[50rem] max-h-[35rem] bg-white p-9 rounded-lg'>
            <h1 className=' text-4xl mb-8 font-semibold font-cursive text-light-dark'>Why Choose Spa-ntaneous?</h1>
              <p className='text-normal leading-8 font-normal font-montserrat mb-9 text-balance'> Expert Therapists: Our passionate team brings years of experience and a genuine commitment to your well-being.
                  Luxurious Ambiance: Immerse yourself in a tranquil environment designed to uplift your senses.
                  Tailored Treatments: Every session is customized to address your unique needs.
              </p>
          </div>
              
          <div className="flex flex-wrap justify-center ">
            <div className='  p-9 bg-white max-w-[50rem] rounded-lg '>
              <h1 className=' text-4xl mb-8 font-semibold font-cursive text-light-dark'>Our Philosopy</h1>
              <p className='text-normal leading-8 font-normal font-montserrat mb-9 text-balance'> We blend ancient healing traditions with modern wellness techniques, creating a harmonious balance for your mind, body, and spirit. Let us guide you on a journey to inner peace and renewed vitality.</p>
            </div>

            <div className='flex justify-center flex-wrap gap-5 m-4'>
              <div className="w-[18rem] h-[20rem] max-sm:w-[20rem] max-sm:h-[20rem] bg-black hover:transform hover:scale-110 transition-transform duration-500 bg-center bg-cover rounded-[20px] border-2" style={{ backgroundImage: `url(${bg1})`}}>
              </div>
              <div className="w-[18rem] h-[20rem] max-sm:w-[20rem] max-sm:h-[20rem] bg-black hover:transform hover:scale-110 transition-transform duration-500 bg-center bg-cover rounded-[20px] border-2" style={{ backgroundImage: `url(${bg2})`}}>
              </div>
            </div>
          </div>
                        
        </div>
      </section>
                
      <section className="pb-[4rem]  mt-4   mx-auto bg-cover bg-center   "  style={{ backgroundImage: `url(${bg4})` }}>
        <div className='text-center mb-[3rem]  '>
          <h1 className='font-bold font-cursive text-custom text-light bg-dark p-4'>Gallery</h1>
        </div>
        <Gallery/>
      </section>

      <section className=" relative mx-auto " >
        <Footer/>
      </section>

      <ScrollToTopButton />
    </main>
  );
};

export default Aboutpage;
