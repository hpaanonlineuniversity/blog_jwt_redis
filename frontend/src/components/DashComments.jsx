import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setShowMore(data.comments.length === 9);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      
      if (res.ok) {
        setComments([...comments, ...data.comments]);
        setShowMore(data.comments.length === 9);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(comments.filter(comment => comment._id !== commentIdToDelete));
        setCommentIdToDelete('');
      } else {
        console.log('Failed to delete comment');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const formatContent = (content) => {
    if (content.length > 50) {
      return content.substring(0, 50) + '...';
    }
    return content;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className='w-full mx-auto p-3'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          {/* Table Header */}
          <div className='grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600 font-semibold text-sm'>
            <div className='col-span-2'>Date created</div>
            <div className='col-span-3'>Comment content</div>
            <div className='col-span-1 text-center'>Likes</div>
            <div className='col-span-2'>Post ID</div>
            <div className='col-span-2'>User ID</div>
            <div className='col-span-2 text-center'>Actions</div>
          </div>

          {/* Table Body */}
          <div className='bg-white dark:bg-gray-800 rounded-b-lg shadow-md'>
            {comments.map((comment) => (
              <div 
                key={comment._id} 
                className='grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'
              >
                {/* Date */}
                <div className='col-span-2 flex items-center text-sm text-gray-600 dark:text-gray-300'>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>

                {/* Comment Content */}
                <div className='col-span-3 flex items-center'>
                  <span 
                    className='text-sm text-gray-700 dark:text-gray-200'
                    title={comment.content}
                  >
                    {formatContent(comment.content)}
                  </span>
                </div>

                {/* Number of Likes */}
                <div className='col-span-1 flex items-center justify-center'>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${
                    comment.numberOfLikes > 0 
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
                      : 'text-gray-500 bg-gray-50 dark:bg-gray-700'
                  }`}>
                    {comment.numberOfLikes}
                  </span>
                </div>

                {/* Post ID */}
                <div className='col-span-2 flex items-center'>
                  <span 
                    className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 truncate"
                    title={comment.postId}
                  >
                    {comment.postId.substring(0, 8)}...
                  </span>
                </div>

                {/* User ID */}
                <div className='col-span-2 flex items-center'>
                  <span 
                    className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 truncate"
                    title={comment.userId}
                  >
                    {comment.userId.substring(0, 8)}...
                  </span>
                </div>

                {/* Delete Action */}
                <div className='col-span-2 flex items-center justify-center'>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setCommentIdToDelete(comment._id);
                    }}
                    className='px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-md transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {showMore && (
            <div className='flex justify-center mt-6'>
              <button
                onClick={handleShowMore}
                className='px-6 py-2 text-teal-600 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/30 dark:text-teal-400 rounded-lg font-medium transition-colors'
              >
                Show more
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">You have no comments yet!</p>
          <p className="text-gray-400 text-sm">Comments will appear here once users start commenting on posts.</p>
        </div>
      )}

      {/* Modal component */}

      <DeleteConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteComment}
        title="Delete Comment Confirmation"
        message="Are you sure you want to delete this Comment? This action cannot be undone and the comment will be permanently removed."
        confirmText = "Yes, Delete It"
        cancelText = "Cancel"
      />

    </div>
  );
}