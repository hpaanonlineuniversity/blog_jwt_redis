import { Button } from 'flowbite-react';
import { Link } from 'react-router';

export default function CallToAction() {
  return (
    <section className='max-w-4xl mx-auto w-full mt-12 px-4'>
      <div className='bg-gray-800/80 backdrop-blur-md p-8 rounded-xl text-center border border-gray-700/50 shadow-2xl'>
        <h3 className='text-xl font-bold text-white mb-3'>Master Web Security</h3>
        <p className='text-gray-300 mb-6'>Learn from PortSwigger's Web Security Academy</p>
        <div className='flex flex-wrap gap-3 justify-center'>
          <a href="https://portswigger.net/web-security" target="_blank" rel="noopener noreferrer">
            <Button color="purple">
              🔒 PortSwigger Academy
            </Button>
          </a>
          <Link to='/search'>
            <Button color="light">
              More Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}