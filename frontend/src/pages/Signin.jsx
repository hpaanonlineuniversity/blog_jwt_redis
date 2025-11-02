// src/components/SignIn.js
import { Alert, Button, Label, Spinner, TextInput, Card } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import OAuth from '../components/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { apiInterceptor } from '../utils/apiInterceptor'; // ✅ Import the interceptor

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());
      
      // ✅ Use apiInterceptor instead of direct fetch
      const res = await apiInterceptor.request('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        // credentials: 'include' is already handled in interceptor
      });
      
      const data = await res.json();
      console.log('SignIn Response:', data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      if (res.ok) {
        // User data formatting
        const userData = {
          _id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          profilePicture: data.user.profilePicture,
          isAdmin: data.user.isAdmin,
        };
        
        dispatch(signInSuccess(userData));
        navigate('/');
      }
    } catch (error) {
      console.error('SignIn error:', error);
      dispatch(signInFailure(
        error.message || 'Sign in failed. Please try again.'
      ));
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
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block mt-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline transition-colors'
            >
              Join our community on GitHub →
            </a>
          </Card>

          {/* Sign In Form Card */}
          <Card>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Welcome Back
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>
                Sign in to your account
              </p>
            </div>

            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
                <div className='flex justify-between items-center'>
                  <Label htmlFor='password' value='Password' />
                  <Link 
                    to='/forgot-password'
                    className='text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline'
                  >
                    Forgot password?
                  </Link>
                </div>
                <TextInput
                  type='password'
                  placeholder='Enter your password'
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
                className='w-full mt-2'
                size='lg'
              >
                {loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Signing In...</span>
                  </>
                ) : (
                  'Sign In'
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

            {/* Sign Up Link */}
            <div className='text-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <span className='text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <Link 
                  to='/sign-up' 
                  className='text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium'
                >
                  Sign Up
                </Link>
              </span>
            </div>
          </Card>

          {/* Error Message */}
          {errorMessage && (
            <Alert className='mt-4' color='failure'>
              <span className='font-medium'>Sign in failed!</span> {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}