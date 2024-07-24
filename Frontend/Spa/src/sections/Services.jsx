import React, { useState } from 'react';
import bg1 from '../assets/img/massage.jpg';
import bg2 from '../assets/img/facial.jpg';
import bg3 from '../assets/img/Nail.jpg';
import bg4 from '../assets/img/body.jpg';
import img1 from '../assets/img/m.png';
import img2 from '../assets/img/F.png';
import img3 from '../assets/img/N.png';
import img4 from '../assets/img/B.png';
import closeIcon from '../assets/icons/close.svg';


const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleClosePopup = () => {
    setSelectedService(null);
  };

  return (
    <div className="text-center  padding ">

  
      <h1 className="font-bold  text-[50px] mb-4 tracking-wide text-dark sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-cursive ">What We Offer</h1>
      <div className="flex justify-center">
        <div className="border-2 border-dark mt-1 w-[10rem] mb-9"></div>
      </div>

      <div className="flex justify-center gap-[7rem] mt-9 flex-wrap ">
        <ServiceTab title="Massage" image={img1} onClick={() => handleServiceSelect({ title: 'Massage', description: 'Relax and rejuvenate with our professional massage therapy. Our experienced therapists will help you relieve stress and tension, leaving you feeling refreshed and revitalized.', image: bg1 })} />
        <ServiceTab title="Facial" image={img2} onClick={() => handleServiceSelect({ title: 'Facial', description: 'Indulge in our range of facial treatments designed to nourish and revitalize your skin. From deep cleansing to hydration, our facials will leave your skin glowing and radiant.', image: bg2 })} />
        <ServiceTab title="Nail Treatment" image={img3} onClick={() => handleServiceSelect({ title: 'Nail Treatment', description: 'Pamper yourself with our professional nail treatments. From manicures to pedicures, our skilled technicians will keep your nails healthy and beautiful.', image: bg3 })} />
        <ServiceTab title="Body Treatment" image={img4} onClick={() => handleServiceSelect({ title: 'Body Treatment', description: 'Experience ultimate relaxation with our range of body treatments. From body wraps to scrubs, our treatments will leave your skin smooth, hydrated, and revitalized.', image: bg4 })} />
      </div>

      {selectedService && (
        <Popup
          title={selectedService.title}
          description={selectedService.description}
          image={selectedService.image}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

const ServiceTab = ({ title, image, onClick }) => {
  return (
    <div className="cursor-pointer relative" onClick={onClick}>
      <img src={image} alt={title} className="w-[16rem] h-[15rem] object-cover rounded-lg transition-transform duration-500 transform hover:scale-110 " />
      <p className="absolute inset-x-0 bottom-0 rounded-b-full bg-dark text-white text-center py-2 mb-4">{title}</p>
      <p className=" inset-x-0 bottom-0 bg-gray-800 text-gray-200 text-center py-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">{title}</p>
    </div>
  );
};

const Popup = ({ title, description, image, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 max-w-lg mx-auto rounded-lg relative">
        <button className="absolute top-1 right-1 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <img src={closeIcon} alt="Close" className="h-6 w-6" />
        </button>
        <div className="w-full h-64 bg-cover bg-center mb-9 rounded-lg" style={{ backgroundImage: `url(${image})` }}></div>
        <h2 className="text-2xl font-semibold mb-9">{title}</h2>
        <p>{description}</p>
        <div className='m-8'>
        <a href='/services' className="mt-4 bg-dark hover:bg-light-dark text-white font-semibold py-2 px-4 rounded" >
          Explore
        </a>
        </div>
  
      </div>
    </div>
  );
};

export default Services;
