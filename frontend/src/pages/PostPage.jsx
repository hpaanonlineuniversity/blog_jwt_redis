import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(false);
        setImageError(false);
        
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        
        if (data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
          
          // Fetch recent posts
          try {
            const recentRes = await fetch('/api/post/getposts?limit=4&sortDirection=desc');
            const recentData = await recentRes.json();
            if (recentRes.ok && recentData.posts) {
              // Filter out the current post from recent posts and take first 3
              const filteredRecentPosts = recentData.posts.filter(
                (recentPost) => recentPost._id !== data.posts[0]._id
              );
              setRecentPosts(filteredRecentPosts.slice(0, 3));
            }
          } catch (recentError) {
            console.error('Error fetching recent posts:', recentError);
            // Don't set error for recent posts failure
          }
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postSlug]);

  // Calculate reading time more accurately
  const calculateReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = textContent.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute)); // At least 1 min
  };

  // Handle error state
  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen px-4'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>Post Not Found</h1>
          <p className='text-gray-600 mb-6'>The post you're looking for doesn't exist or may have been removed.</p>
          <Link to='/'>
            <Button color='blue' className='px-6'>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  if (!post) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <p className='text-gray-600'>No post data available.</p>
        </div>
      </div>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      {/* Post Header */}
      <header className='text-center mt-8 mb-6 px-4'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 font-serif leading-tight'>
          {post.title}
        </h1>
        
        {/* Category */}
        <div className='mt-6'>
          <Link to={`/search?category=${post.category}`}>
            <Button color='gray' pill size='sm' className='hover:bg-gray-200 transition-colors'>
              {post.category}
            </Button>
          </Link>
        </div>

        {/* Post Meta Information */}
        <div className='flex justify-center items-center gap-6 mt-4 text-sm text-gray-500'>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span>•</span>
          <span className='italic'>
            {calculateReadingTime(post.content)} min read
          </span>
        </div>
      </header>
      
      {/* Featured Image */}
      {post.image && !imageError ? (
        <div className='my-8 px-4'>
          <img
            src={post.image}
            alt={post.title}
            className='w-full max-h-[600px] object-cover rounded-xl shadow-lg'
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className='my-8 px-4'>
          <div className='w-full h-64 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl flex items-center justify-center'>
            <div className='text-center text-teal-600'>
              <svg className='w-16 h-16 mx-auto mb-3 opacity-50' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className='text-sm font-medium'>Featured Image</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Post Content */}
      <article className='flex-1 px-4'>
        <div 
          className='prose prose-lg max-w-4xl mx-auto w-full 
                     prose-headings:text-gray-800 
                     prose-p:text-gray-700 
                     prose-p:leading-relaxed
                     prose-a:text-teal-600 
                     prose-a:no-underline 
                     prose-a:border-b-2 
                     prose-a:border-teal-300 
                     prose-a:hover:border-teal-600 
                     prose-strong:text-gray-800 
                     prose-blockquote:border-l-teal-500 
                     prose-blockquote:bg-teal-50 
                     prose-blockquote:py-1 
                     prose-ul:text-gray-700 
                     prose-ol:text-gray-700 
                     prose-li:text-gray-700'
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      
      {/* Call to Action Section */}
      <CallToAction />

      {/* Comment Section */}
      <section className='max-w-4xl mx-auto w-full mt-12 px-4'>
        <div className='border-t border-gray-200 pt-8'>
          <CommentSection postId={post._id} />
        </div>
      </section>

      {/* Recent Posts Section */}
      {recentPosts && recentPosts.length > 0 && (
        <section className='max-w-6xl mx-auto w-full mt-16 mb-8 px-4'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl font-bold text-gray-800 mb-3'>Recent Articles</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Discover more interesting content from our latest publications
            </p>
          </div>
          <div className='flex flex-wrap justify-center gap-6'>
            {recentPosts.map((recentPost) => (
              <PostCard 
                key={recentPost._id} 
                post={recentPost} 
              />
            ))}
          </div>
          <div className='text-center mt-8'>
            <Link to='/search'>
              <Button color='light' className='px-8'>
                View All Articles
              </Button>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}