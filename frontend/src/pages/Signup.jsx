import { Alert, Button, Label, Spinner, TextInput, Card } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import OAuth from '../components/OAuth';


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4'>
      <div className='flex justify-center items-center'>
        <div className='max-w-md w-full'>
          {/* Header Card */}
          <Card className='mb-8 text-center'>
            <div className='flex justify-center mb-4'>
              <Link to='/' className='flex items-center gap-2'>
                <span className='px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-2xl font-bold'>
                  Hpa-an's
                </span>
                <span className='text-xl font-semibold dark:text-white'>
                  Blog
                </span>
              </Link>
            </div>
            <a 
              href='https://github.com/hpaanonlineuniversity'
              className='text-purple-600 hover:text-purple-700 hover:underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              Join our community on GitHub
            </a>
          </Card>

          {/* Sign Up Form Card */}
          <Card>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Create Account
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>
                Sign up to get started
              </p>
            </div>

            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <Label htmlFor='username' value='Username' />
                <TextInput
                  type='text'
                  placeholder='Enter your username'
                  id='username'
                  onChange={handleChange}
                  required
                  shadow
                />
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='email' value='Email Address' />
                <TextInput
                  type='email'
                  placeholder='name@company.com'
                  id='email'
                  onChange={handleChange}
                  required
                  shadow
                />
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor='password' value='Password' />
                <TextInput
                  type='password'
                  placeholder='Create a password'
                  id='password'
                  onChange={handleChange}
                  required
                  shadow
                />
              </div>

              <Button
                color="purple"
                type='submit'
                disabled={loading}
                className='w-full mt-4'
                size='lg'
              >
                {loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Creating Account...</span>
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className='flex items-center my-6'>
              <div className='flex-1 border-t border-gray-300 dark:border-gray-600'></div>
              <span className='px-3 text-gray-500 dark:text-gray-400 text-sm'>Or continue with</span>
              <div className='flex-1 border-t border-gray-300 dark:border-gray-600'></div>
            </div>

            {/* OAuth Section */}
            <OAuth/>

            {/* Sign In Link */}
            <div className='text-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <span className='text-gray-600 dark:text-gray-400'>
                Already have an account?{' '}
                <Link 
                  to='/sign-in' 
                  className='text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium'
                >
                  Sign In
                </Link>
              </span>
            </div>
          </Card>

          {/* Error Message */}
          {errorMessage && (
            <Alert className='mt-4' color='failure'>
              <span className='font-medium'>Error!</span> {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}