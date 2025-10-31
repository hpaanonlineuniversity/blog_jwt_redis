import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { supabase } from '../supabase';

export default function OAuth() {

    const handleGoogleClick = async () =>{
    try{
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
       }
      });

      if (error) {
        console.log('Could not login with Github', error);
      }
      } catch (error) {
        console.log('Could not login with Github', error);
      }
    }; 
  return (
    <Button type='button' color="purple" outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}