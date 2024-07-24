import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';


const Contact = () => {
  return (
    <div className="px-4 py-8 md:py-16 md:px-8 max-container">
      <div className='text-center mb-8 md:mb-12'>
        <h1 className='font-bold md:text-5xl font-cursive text-custom text-dark'>Contact Us</h1>
        <div className="border-b-2 border-dark mt-4 w-20 mx-auto"></div>
      </div>
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
  );
};

const InfoCard = ({ icon, title, info }) => {
  return (
    <div className="bg-dark shadow-xl shadow-light-dark text-light rounded-lg p-4 flex flex-col justify-center items-center transition-transform transform hover:scale-105">
      {icon}
      <h3 className="font-semibold text-md md:text-lg mt-2">{title}</h3>
      <p className="text-center">{info}</p>
    </div>
  );
};

export default Contact;
