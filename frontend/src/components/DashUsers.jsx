import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
          setStartIndex(9); // Set initial startIndex for next fetch
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
        setStartIndex((prev) => prev + 9);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        credentials: 'include',
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      }

      // Remove deleted user from state
      setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      setShowModal(false);
      setUserIdToDelete('');
    } catch (error) {
      console.log(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
  try {
    const res = await fetch(`/api/user/update-admin/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        isAdmin: !currentAdminStatus
      }),
    });
    
    const data = await res.json();
    if (res.ok) {
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isAdmin: !currentAdminStatus } : user
      ));
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};

  return (
    <div className='overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin ? (
        <>
          <h1 className='text-3xl font-bold mb-6 text-center'>Users Management</h1>
          {users.length > 0 ? (
            <>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-md rounded-lg overflow-hidden'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th className='px-6 py-3'>Date created</th>
                    <th className='px-6 py-3'>User image</th>
                    <th className='px-6 py-3'>Username</th>
                    <th className='px-6 py-3'>Email</th>
                    <th className='px-6 py-3'>Admin</th>
                    <th className='px-6 py-3'>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user._id} 
                      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    >
                      <td className='px-6 py-4'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4'>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                        />
                      </td>
                      <td className='px-6 py-4 font-medium text-gray-900 dark:text-white'>
                        {user.username}
                      </td>
                      <td className='px-6 py-4'>{user.email}</td>

                      <td className='px-6 py-4'>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={user.isAdmin}
                            onChange={() => handleToggleAdmin(user._id, user.isAdmin)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                      </td>

                      <td className='px-6 py-4'>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className='font-medium text-red-500 hover:underline cursor-pointer'
                        >
                          Delete
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showMore && (
                <button
                  onClick={handleShowMore}
                  disabled={loading}
                  className='w-full text-teal-500 self-center text-sm py-7 disabled:opacity-50 disabled:cursor-not-allowed hover:text-teal-600 transition-colors'
                >
                  {loading ? 'Loading...' : 'Show more'}
                </button>
              )}
            </>
          ) : (
            !loading && <p className='text-center text-gray-500 py-8'>You have no users yet!</p>
          )}
          {loading && users.length === 0 && (
            <p className='text-center text-gray-500 py-8'>Loading users...</p>
          )}
        </>
      ) : (
        <p className='text-center text-red-500 py-8'>Access denied. Admin privileges required.</p>
      )}
 
      {/* Modal component */}
      
      <DeleteConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteUser}
        title="Delete User Confirmation"
        message="Are you sure you want to delete this user? This action cannot be undone and the user will be permanently removed."
        confirmText = "Yes, Delete It"
        cancelText = "Cancel"
      />

    </div>
  );
}