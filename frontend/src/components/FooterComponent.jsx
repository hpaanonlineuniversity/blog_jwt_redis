import { Footer, FooterCopyright, FooterLink, FooterLinkGroup, FooterTitle, FooterIcon } from "flowbite-react";
import { BsGithub, BsFacebook, BsTwitter, BsInstagram } from 'react-icons/bs';
import { Link } from 'react-router';

export default function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer container className="border-t-2">
      <div className="w-full max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-lg font-bold mr-2'>
                ဘားအံ's
              </span>
              <span className='text-xl font-semibold dark:text-white'>
                Blog App
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Sharing knowledge, insights, and stories from Hpa-an. Join our community of learners and creators.
            </p>
            <div className="flex space-x-4">
              <FooterIcon 
                href="https://facebook.com" 
                icon={BsFacebook}
                className="hover:text-purple-600 transition-colors"
              />
              <FooterIcon 
                href="https://twitter.com" 
                icon={BsTwitter}
                className="hover:text-purple-600 transition-colors"
              />
              <FooterIcon 
                href="https://github.com/hpaanonlineuniversity" 
                icon={BsGithub}
                className="hover:text-purple-600 transition-colors"
              />
              <FooterIcon 
                href="https://instagram.com" 
                icon={BsInstagram}
                className="hover:text-purple-600 transition-colors"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <FooterTitle title="Quick Links" />
            <FooterLinkGroup col>
              <FooterLink as={Link} to="/">
                Home
              </FooterLink>
              <FooterLink as={Link} to="/about">
                About
              </FooterLink>
              <FooterLink as={Link} to="/projects">
                Projects
              </FooterLink>
              <FooterLink href="#">
                Blog
              </FooterLink>
            </FooterLinkGroup>
          </div>

          {/* Support */}
          <div>
            <FooterTitle title="Support" />
            <FooterLinkGroup col>
              <FooterLink href="#">
                Contact Us
              </FooterLink>
              <FooterLink href="#">
                Privacy Policy
              </FooterLink>
              <FooterLink href="#">
                Terms of Service
              </FooterLink>
              <FooterLink href="https://github.com/hpaanonlineuniversity">
                GitHub
              </FooterLink>
            </FooterLinkGroup>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <FooterCopyright 
              href="#" 
              by="Hpa-an's Blog App" 
              year={currentYear}
              className="text-gray-600 dark:text-gray-400"
            />
            <FooterLinkGroup className="mt-4 md:mt-0">
              <FooterLink href="#">
                Privacy Policy
              </FooterLink>
              <FooterLink href="#">
                Terms of Service
              </FooterLink>
              <FooterLink href="#">
                Cookie Policy
              </FooterLink>
            </FooterLinkGroup>
          </div>
        </div>
      </div>
    </Footer>
  );
}