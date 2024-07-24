import { useEffect, useState } from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi'; 
import { animateScroll as scroll } from 'react-scroll'; 
import Nav from '../components/Nav'
import Footer from '../sections/Footer'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import logo from '../assets/img/Logo.png';
import bg from '../assets/img/back.jpg';
import back from '../assets/img/white.jpg';

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

const Contactpage = () => {
  useEffect(() => {
    document.title = 'Contact - Spa-ntaneous'
  },[]);
   
  return (
    <main>
      <section>
        <Nav />
      </section>

      <header className="mx-auto h-[20rem] flex justify-center items-center bg-center bg-cover border-b-8 border-dark" style={{backgroundImage: `url(${bg})`}}>
        <div>
          <h1 className='text-[6rem] text-dark font-extrabold font-palanquin text-center'>Contact Us</h1>
          <h1 className='text-center tracking-widest bg-dark p-2 text-light '><a className='mr-2 hover:text-light-dark transition-colors duration-200 hover:underline' href='/'><span>Home</span></a>/<span className='ml-2'>Contact</span></h1>
        </div>
      </header>
      
      <section className="px-4 py-8 md:py-16 md:px-8 bg-cover bg-center " style={{ backgroundImage: `url(${back})` }} >
      <div className="px-4 py-8 md:py-16 md:px-8 max-container">
      <div className="grid md:grid-cols-1 gap-8 md:gap-12">
        <div className="rounded-lg  p-8 flex flex-col justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <InfoCard icon={<MdEmail className="text-3xl md:text-5xl " />} title="Email" info="Span-taneous@gmail.com" />
            <InfoCard icon={<MdPhone className="text-3xl md:text-5xl " />} title="Phone" info="63+9234567890" />
            <InfoCard icon={<MdLocationOn className="text-3xl md:text-5xl " />} title="Location" info="Daraga, Albay" />
          </div>
        </div>
        <div className="shadow-2xl shadow-black ">
          <iframe className="w-full h-64 md:h-[35.7rem] rounded-md" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6534.2417537176225!2d123.72336418854759!3d13.144515873602993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1712553813306!5m2!1sen!2sph" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
      </section>

      <section>
        <Footer/>
      </section>
      <ScrollToTopButton />
    </main>
  )
}

const InfoCard = ({ icon, title, info }) => {
  return (
    <div className="bg-dark shadow-xl shadow-light-dark text-light rounded-lg p-4 flex flex-col justify-center items-center transition-transform transform hover:scale-105">
      {icon}
      <h3 className="font-semibold text-md md:text-lg mt-2">{title}</h3>
      <p className="text-center">{info}</p>
    </div>
  );
};

export default Contactpage;
