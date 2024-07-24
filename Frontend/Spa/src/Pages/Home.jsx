import React, { useEffect, useState } from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi'; 
import { animateScroll as scroll } from 'react-scroll'; 
import Hero from '../sections/Hero';
import About from '../sections/About';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';
import Gallery from '../sections/Gallery';
import Services from '../sections/Services';
import Nav from '../components/Nav';
import bg2 from '../assets/img/white.jpg';
import bg from '../assets/img/back.jpg';
import bg3 from '../assets/img/spa.jpg';

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

const Home = () => {
  useEffect(() => {
    document.title = 'Home - Spa-ntaneous';
  }, []);

  return (
    <main className="relative">
      <section>
        <Nav />
      </section>

      <section className="mx-auto bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
        <Hero />
      </section>

      <section className="p-[2rem] mt-4 border-t-[4rem] border-dark mx-auto">
        <About />
      </section>

      <section className="mt-5 mx-auto bg-cover bg-center" style={{ backgroundImage: `url(${bg2})` }}>
        <Services />
      </section>

      <section className="pb-[4rem] mt-4 mx-auto bg-cover bg-center" style={{ backgroundImage: `url(${bg3})` }}>
        <div className="text-center mb-[3rem]">
          <h1 className="font-bold font-cursive text-custom text-light bg-dark p-4">Gallery</h1>
        </div>
        <Gallery />
      </section>

      <section className="pt-[4rem] mx-auto border-t-[2rem] border-dark bg-cover bg-center " style={{ backgroundImage: `url(${bg2})` }}>
        <Contact />
      </section>

      <section className="relative mx-auto">
        <Footer />
      </section>

    
      <ScrollToTopButton />
    </main>
  );
};

export default Home;
