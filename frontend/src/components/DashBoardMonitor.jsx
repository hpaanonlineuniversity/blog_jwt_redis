import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiTrendingUp,
  HiUser,
  HiChat,
  HiNewspaper,
} from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { Link } from 'react-router';

export default function DashBoardMonitor() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch('/api/user/getusers?limit=5'),
          fetch('/api/post/getposts?limit=5'),
          fetch('/api/comment/getcomments?limit=5')
        ]);

        const usersData = await usersRes.json();
        const postsData = await postsRes.json();
        const commentsData = await commentsRes.json();

        if (usersRes.ok) {
          setUsers(usersData.users);
          setTotalUsers(usersData.totalUsers);
          setLastMonthUsers(usersData.lastMonthUsers);
        }

        if (postsRes.ok) {
          setPosts(postsData.posts);
          setTotalPosts(postsData.totalPosts);
          setLastMonthPosts(postsData.lastMonthPosts);
        }

        if (commentsRes.ok) {
          setComments(commentsData.comments);
          setTotalComments(commentsData.totalComments);
          setLastMonthComments(commentsData.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.isAdmin) {
      fetchData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Dashboard Overview</h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>Welcome back, {currentUser.username}! Here's what's happening.</p>
      </div>

      {/* Summary Cards - Improved Design */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Users Card */}
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-blue-100 text-sm font-medium'>Total Users</p>
              <p className='text-3xl font-bold mt-2'>{totalUsers}</p>
              <div className='flex items-center mt-3'>
                <HiTrendingUp className='text-green-300 mr-1' />
                <span className='text-green-300 text-sm font-medium'>+{lastMonthUsers} this month</span>
              </div>
            </div>
            <div className='bg-white/20 p-3 rounded-xl'>
              <HiUser className='text-2xl' />
            </div>
          </div>
        </div>

        {/* Posts Card */}
        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-green-100 text-sm font-medium'>Total Posts</p>
              <p className='text-3xl font-bold mt-2'>{totalPosts}</p>
              <div className='flex items-center mt-3'>
                <HiTrendingUp className='text-green-300 mr-1' />
                <span className='text-green-300 text-sm font-medium'>+{lastMonthPosts} this month</span>
              </div>
            </div>
            <div className='bg-white/20 p-3 rounded-xl'>
              <HiNewspaper className='text-2xl' />
            </div>
          </div>
        </div>

        {/* Comments Card */}
        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-purple-100 text-sm font-medium'>Total Comments</p>
              <p className='text-3xl font-bold mt-2'>{totalComments}</p>
              <div className='flex items-center mt-3'>
                <HiTrendingUp className='text-green-300 mr-1' />
                <span className='text-green-300 text-sm font-medium'>+{lastMonthComments} this month</span>
              </div>
            </div>
            <div className='bg-white/20 p-3 rounded-xl'>
              <HiChat className='text-2xl' />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Data Section */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        
        {/* Recent Users */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Recent Users</h2>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>Newly registered users</p>
              </div>
              <Button color="purple" size="sm">
                <Link to={'/dashboard?tab=users'}>View All</Link>
              </Button>
            </div>
          </div>
          <div className='p-4'>
            {users.length > 0 ? (
              <div className='space-y-4'>
                {users.map((user) => (
                  <div key={user._id} className='flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-12 h-12 rounded-full border-2 border-purple-200 dark:border-purple-800'
                    />
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-800 dark:text-white'>{user.username}</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>{user.email}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <HiOutlineUserGroup className='mx-auto text-4xl text-gray-400 mb-3' />
                <p className='text-gray-500 dark:text-gray-400'>No users yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Recent Posts</h2>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>Latest published articles</p>
              </div>
              <Button color="green" size="sm">
                <Link to={'/dashboard?tab=posts'}>View All</Link>
              </Button>
            </div>
          </div>
          <div className='p-4'>
            {posts.length > 0 ? (
              <div className='space-y-4'>
                {posts.map((post) => (
                  <div key={post._id} className='flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                    <img
                      src={post.image}
                      alt={post.title}
                      className='w-16 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-800 dark:text-white truncate' title={post.title}>
                        {post.title}
                      </p>
                      <div className='flex items-center space-x-2 mt-1'>
                        <span className='px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full'>
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <HiDocumentText className='mx-auto text-4xl text-gray-400 mb-3' />
                <p className='text-gray-500 dark:text-gray-400'>No posts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Recent Comments</h2>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>Latest user interactions</p>
              </div>
              <Button color="blue" size="sm">
                <Link to={'/dashboard?tab=comments'}>View All</Link>
              </Button>
            </div>
          </div>
          <div className='p-4'>
            {comments.length > 0 ? (
              <div className='space-y-4'>
                {comments.map((comment) => (
                  <div key={comment._id} className='p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                    <div className='flex justify-between items-start mb-2'>
                      <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1 mr-2'>
                        "{comment.content}"
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        comment.numberOfLikes > 0 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {comment.numberOfLikes} ❤️
                      </span>
                    </div>
                    <div className='flex justify-between items-center text-xs text-gray-500 dark:text-gray-400'>
                      <span>Post: {comment.postId?.substring(0, 8)}...</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <HiAnnotation className='mx-auto text-4xl text-gray-400 mb-3' />
                <p className='text-gray-500 dark:text-gray-400'>No comments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className='mt-8 grid grid-cols-2 md:grid-c-4 gap-4'>
        <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center'>
          <HiOutlineUserGroup className='mx-auto text-2xl text-blue-500 mb-2' />
          <p className='text-2xl font-bold text-gray-800 dark:text-white'>{totalUsers}</p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Total Users</p>
        </div>
        <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center'>
          <HiDocumentText className='mx-auto text-2xl text-green-500 mb-2' />
          <p className='text-2xl font-bold text-gray-800 dark:text-white'>{totalPosts}</p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Total Posts</p>
        </div>
        <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center'>
          <HiAnnotation className='mx-auto text-2xl text-purple-500 mb-2' />
          <p className='text-2xl font-bold text-gray-800 dark:text-white'>{totalComments}</p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Total Comments</p>
        </div>
        <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center'>
          <HiTrendingUp className='mx-auto text-2xl text-orange-500 mb-2' />
          <p className='text-2xl font-bold text-gray-800 dark:text-white'>{lastMonthUsers + lastMonthPosts + lastMonthComments}</p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Monthly Growth</p>
        </div>
      </div>
    </div>
  );
}