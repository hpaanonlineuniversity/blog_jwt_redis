import { 
  Alert, 
  Button, 
  FileInput, 
  Select, 
  TextInput, 
  Textarea,
  Card,
  Label,
  Spinner
} from 'flowbite-react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

export default function CreatePost() {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(undefined);
  const [localPostImage, setLocalPostImage] = useState('');
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [publishError, setPublishError] = useState(null);

  // Initialize formData state
  const [formData, setFormData] = useState({
    title: '',
    category: 'uncategorized',
    content: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  useEffect(() => {
    const savedPostImage = localStorage.getItem('postImage');
    if (savedPostImage) {
      setLocalPostImage(savedPostImage);
      setImagePreview(savedPostImage);
      setFormData(prev => ({ ...prev, image: savedPostImage }));
    }
  }, []);

  const handleFileUpload = async (image) => {
    try {
      if (!image) {
        throw new Error('No file selected');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB for posts
      if (image.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const base64String = event.target.result;
          localStorage.setItem('postImage', base64String);
          setLocalPostImage(base64String);
          setImagePreview(base64String);
          setFormData(prev => ({ ...prev, image: base64String }));
          console.log('Post image saved to local storage successfully');
        } catch (error) {
          console.error('Error processing file:', error.message);
          alert('Error saving post image: ' + error.message);
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

  const clearPostImage = () => {
    localStorage.removeItem('postImage');
    setLocalPostImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    console.log('Post image cleared from local storage');
  };

  const handleImageUpload = () => {
    // Image upload logic will be handled by parent component
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 1000); // Simulate upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    console.log('Form Data:', formData);
    
    try {
      const res = await fetch('/api/post/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Update response:', data);

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        // localStorage ကပုံကိုဖျက်ရန်
        localStorage.removeItem('postImage');
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
    finally {
      setLoading(false); // loading ပြီးမယ်
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Create New Post
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Share your thoughts and ideas with the world
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-2">
                  <Label 
                    htmlFor="title" 
                    value="Post Title" 
                    className="text-lg font-medium text-gray-700 dark:text-white" 
                  />
                </div>
                <TextInput
                  id="title"
                  type="text"
                  placeholder="Enter a compelling title..."
                  required
                  sizing="lg"
                  value={formData.title}
                  onChange={handleChange}
                  className="text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <div>
                <div className="mb-2">
                  <Label 
                    htmlFor="category" 
                    value="Category" 
                    className="text-lg font-medium text-gray-700 dark:text-white" 
                  />
                </div>
                <Select
                  id="category"
                  required
                  sizing="lg"
                  value={formData.category}
                  onChange={handleChange}
                  className="text-gray-900 dark:text-white"
                >
                  <option value="uncategorized">Select a category</option>
                  <option value="javascript">JavaScript</option>
                  <option value="reactjs">React.js</option>
                  <option value="nextjs">Next.js</option>
                  <option value="webdev">Web Development</option>
                  <option value="programming">Programming</option>
                  <option value="technology">Technology</option>
                </Select>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="mb-2">
                <Label 
                  htmlFor="content" 
                  value="Post Content" 
                  className="text-lg font-medium text-gray-700 dark:text-white" 
                />
              </div>
              <Textarea
                id="content"
                placeholder="Write your post content here... You can use markdown formatting."
                required
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className="resize-y text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div>
                <Label 
                  value="Featured Image" 
                  className="text-lg font-medium text-gray-700 dark:text-white" 
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Add a compelling image to make your post stand out
                </p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-purple-50 hover:to-blue-50 dark:hover:from-gray-750 dark:hover:to-gray-800">
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  {/* Image Preview */}
                  <div className="flex-1">
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 lg:h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={clearPostImage}
                          className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 shadow-lg hover:scale-110"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-300 dark:text-gray-600 mb-3 transition-colors duration-300">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 font-medium">No image selected</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click browse to select an image</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-4">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <FileInput
                          ref={fileRef}
                          id="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full text-gray-900 dark:text-white border-none focus:ring-0 focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Supported formats: JPG, PNG, GIF, WEBP • Max size: 5MB
                      </p>
                    </div>
                    
                    <Button
                      type="button"
                      color="purple"
                      onClick={handleImageUpload}
                      disabled={!imagePreview || isUploading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-transparent shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {isUploading ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              
              {publishError && (
                  <Alert color="failure" className="mb-4">
                    {publishError}
                  </Alert>
              )}

              <Button
                type="submit"
                color="purple"
                disabled={loading}
                className="sm:w-auto w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Post
                  </>
                )}
              </Button>



            </div>
          </form>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Check out our{' '}
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
              writing guidelines
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}