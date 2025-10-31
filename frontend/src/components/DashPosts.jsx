import { Button, Badge, Spinner, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { 
  HiOutlineNewspaper, 
  HiOutlineEye, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlinePlus,
  HiSearch
} from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    if (currentUser?._id) {
      fetchUserPosts();
    }
  }, [currentUser?._id]);

  const fetchUserPosts = async (startIndex = 0) => {
    try {
      setError('');
      setLoading(true);
      const searchParams = new URLSearchParams({
        userId: currentUser._id,
        startIndex: startIndex.toString(),
        limit: '8',
        ...(searchTerm && { searchTerm }),
        ...(filterCategory && { category: filterCategory }),
      });

      const res = await fetch(`/api/post/getposts?${searchParams}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      if (startIndex === 0) {
        setUserPosts(data.posts);
      } else {
        setUserPosts(prev => [...prev, ...data.posts]);
      }

      setShowMore(data.posts.length === 8);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    await fetchUserPosts(startIndex);
  };

  const handleDeletePost = async () => {
    try {
      setError('');
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      setUserPosts(prev => prev.filter(post => post._id !== postIdToDelete));
      setShowModal(false);
      setPostIdToDelete('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUserPosts(0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    fetchUserPosts(0);
  };

  // Get unique categories for filter
  const categories = [...new Set(userPosts.map(post => post.category).filter(Boolean))];

  if (loading && userPosts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner size="xl" />
        <span className="ml-3 text-lg">Loading your posts...</span>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your blog posts
          </p>
        </div>
        <Link
          to="/create-post"
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all shadow-md"
        >
          <HiOutlinePlus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
            Search
          </Button>
          <Button type="button" color="light" onClick={handleResetFilters}>
            Reset
          </Button>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" className="mb-6">
          <span>{error}</span>
        </Alert>
      )}

      {/* Posts Table - Custom Implementation */}
      {userPosts.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Date Updated</th>
                  <th scope="col" className="px-6 py-3">Post Image</th>
                  <th scope="col" className="px-6 py-3">Title & Content</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userPosts.map((post) => (
                  <tr key={post._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.updatedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/post/${post.slug}`}>
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-16 h-12 object-cover rounded-lg bg-gray-200 dark:bg-gray-600 hover:opacity-90 transition-opacity"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x48?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <Link 
                          to={`/post/${post.slug}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {post.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color="info" className="w-fit">
                        {post.category || 'Uncategorized'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color="success" className="w-fit">
                        Published
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/post/${post.slug}`}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Post"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/update-post/${post._id}`}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Edit Post"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Post"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) :(
      <div className="text-center py-12">
        <HiOutlineNewspaper className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {searchTerm || filterCategory ? 'No matching posts found' : 'No posts yet'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {searchTerm || filterCategory 
            ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
            : 'Start sharing your thoughts with the world! Create your first blog post to get started.'}
        </p>
        <Link
          to="/create-post"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Create Your First Post
        </Link>
      </div>
    )} 
      {/* Show More Button */}
      {showMore && userPosts.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleShowMore}
            className="bg-teal-500 hover:bg-teal-600 px-8"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Load More Posts
          </Button>
        </div>
      )}

      <div className="p-6 mx-auto">
        
      {/* Modal component */}

      <DeleteConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeletePost}
        title="Delete Post Confirmation"
        message="Are you sure you want to delete this post? This action cannot be undone and the post will be permanently removed."
        confirmText = "Yes, Delete It"
        cancelText = "Cancel"
      />
       </div>

    </div>
  );
}