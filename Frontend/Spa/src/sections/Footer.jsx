import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import Font Awesome icons
import logo from '../assets/img/Logo.png';
import bg from '../assets/img/back.jpg';

const Footer = () => {
  return (
    <footer className="bg-dark text-dark py-4 transform scale-x-[-1] " style={{ backgroundImage: `url(${bg})` }}>
      <div className="container mx-auto transform scale-x-[-1]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <div className="flex justify-center items-center mb-9">
            <img src={logo} alt="Logo" className="w-64" />
          </div>
          <div className="md:mb-8 flex gap-8 justify-center flex-wrap">
            <div className=" mt-9">
              <h3 className="font-bold text-xl mb-4">Opening Hours</h3>
              <p className="text-gray-600">Monday-Friday: 9am - 6pm</p>
              <p className="text-gray-600">Saturday: 10am - 4pm</p>
              <p className="text-gray-600">Sunday: Closed</p>

              <h3 className="font-bold text-xl mb-4 mt-5">Social Links</h3>
              <ul className="list-none">
                <li>
                  <a href="#" className="text-gray-600 hover:text-light-dark">
                    <FaFacebook className="inline-block align-text-bottom mr-2" />
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-light-dark">
                    <FaTwitter className="inline-block align-text-bottom mr-2" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-light-dark">
                    <FaInstagram className="inline-block align-text-bottom mr-2" />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-dark">&copy; {new Date().getFullYear()} Spa-ntaneous</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
