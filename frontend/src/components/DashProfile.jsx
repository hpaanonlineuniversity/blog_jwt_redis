import { Avatar, Button, Card, Label, TextInput, Textarea, FileInput, Alert } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import { Link } from 'react-router';

export default function DashProfile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);
  const [localProfilePic, setLocalProfilePic] = useState(currentUser?.profilePicture || '');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    profilePicture: currentUser?.profilePicture || ''
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const updateFormDataWithProfilePic = (profilePic) => {
    if (profilePic) {
      setFormData(prevFormData => ({
        ...prevFormData,
        profilePicture: profilePic
      }));
    }
  };

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  useEffect(() => {
    const savedProfilePic = localStorage.getItem('profilePicture');
    if (savedProfilePic) {
      setLocalProfilePic(savedProfilePic);
      updateFormDataWithProfilePic(savedProfilePic);
    }
    
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '',
        profilePicture: currentUser.profilePicture || savedProfilePic || ''
      });
    }
  }, [currentUser]);

  const handleFileUpload = async (image) => {
    try {
      if (!image) {
        throw new Error('No file selected');
      }

      const maxSize = 2 * 1024 * 1024;
      if (image.size > maxSize) {
        throw new Error('File size must be less than 2MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const base64String = event.target.result;
          localStorage.setItem('profilePicture', base64String);
          setLocalProfilePic(base64String);
          updateFormDataWithProfilePic(base64String);
          console.log('Profile picture saved to local storage successfully');
        } catch (error) {
          console.error('Error processing file:', error.message);
          alert('Error saving profile picture: ' + error.message);
        }
      };

      reader.onerror = (error) => {
        console.error('File reading error:', error);
        alert('Error reading file');
      };

      reader.readAsDataURL(image);
    } catch (error) {
      console.error('Error uploading file:', error.message);
      alert(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Update response:', data);

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.log("error", error);
      dispatch(updateUserFailure(error));
    }
  };

  const clearProfilePicture = () => {
    localStorage.removeItem('profilePicture');
    setLocalProfilePic(null);
    setFormData(prev => ({ ...prev, profilePicture: '' }));
    console.log('Profile picture cleared from local storage');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`/api/user/signout`);
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and account preferences
          </p>
        </div>

        {/* Status Alerts */}
        <div className="mb-6">
          {updateSuccess && (
            <Alert color="success" className="mb-4">
              <span className="font-medium">Success!</span> Your profile has been updated successfully.
            </Alert>
          )}
          
          {error && (
            <Alert color="failure" className="mb-4">
              <span className="font-medium">Error!</span> {error.message || 'Something went wrong. Please try again.'}
            </Alert>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-xl dark:shadow-gray-800/30 bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Profile Picture */}
              <div className="lg:col-span-1">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Picture</h3>
                  
                  <div className="relative inline-block mb-6">
                    <Avatar
                      img={localProfilePic || currentUser?.profilePicture || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                      alt="Profile picture"
                      size="xxl"
                      rounded
                      className="border-4 border-white dark:border-gray-700 shadow-lg mx-auto lg:mx-0"
                    />
                    <div className="absolute -bottom-2 -right-2">
                      <Button 
                        size="xs" 
                        color="light"
                        onClick={() => fileRef.current?.click()}
                        className="rounded-full shadow-lg border border-gray-200 dark:border-gray-600"
                      >
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FileInput 
                      ref={fileRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>Supported formats: JPG, PNG, GIF, WebP</p>
                      <p>Maximum file size: 2MB</p>
                    </div>

                    {localProfilePic && (
                      <Button 
                        color="light" 
                        size="sm" 
                        onClick={clearProfilePicture}
                        className="w-full border border-gray-200 dark:border-gray-600 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove Current Photo
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column - Personal Information */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                      Personal Information
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="username" value="Username" className="mb-2 block font-medium text-gray-700 dark:text-gray-300" />
                          <TextInput
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" value="Email Address" className="mb-2 block font-medium text-gray-700 dark:text-gray-300" />
                          <TextInput
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="password" value="New Password" className="mb-2 block font-medium text-gray-700 dark:text-gray-300" />
                        <TextInput
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          className="w-full"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Leave blank to keep your current password
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Information & Security Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Account Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Security Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h5 className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-1">Password Status</h5>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {formData.password ? 'New password will be updated' : 'Current password is active'}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-300 text-sm mb-1">Session</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            You are currently signed in on this device
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      color="purple" 
                      className="flex-1 justify-center"
                      type="submit"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {loading ? 'Saving Changes...' : 'Save Changes'}
                    </Button>

                    {currentUser.isAdmin && (
                      <Link to="/create-post" >
                        <Button
                          type='button'
                          color='purple'
                          className='w-full'
                        >
                          Create a post
                        </Button>
                      </Link>
                    )}

                    <Button 
                      color="light" 
                      className="flex-1 justify-center text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                      onClick={handleSignOut}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </Button>

                    <Button 
                      color="failure" 
                      className="flex-1 justify-center"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}