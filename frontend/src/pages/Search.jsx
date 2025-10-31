import { Button, Select, TextInput, Spinner, Badge } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import PostCard from '../components/PostCard';
import { HiSearch, HiFilter, HiRefresh, HiX } from 'react-icons/hi';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    
    const hasFilters = searchTermFromUrl || sortFromUrl || categoryFromUrl;
    setFiltersApplied(hasFilters);

    if (hasFilters) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'uncategorized',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        setShowMore(data.posts.length === 9);
      }
    };
    
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebarData.searchTerm) urlParams.set('searchTerm', sidebarData.searchTerm);
    if (sidebarData.sort !== 'desc') urlParams.set('sort', sidebarData.sort);
    if (sidebarData.category !== 'uncategorized') urlParams.set('category', sidebarData.category);
    
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setShowSidebar(false);
  };

  const handleClearFilters = () => {
    setSidebarData({
      searchTerm: '',
      sort: 'desc',
      category: 'uncategorized',
    });
    navigate('/search');
    setFiltersApplied(false);
    setShowSidebar(false);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    
    const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (sidebarData.searchTerm) count++;
    if (sidebarData.sort !== 'desc') count++;
    if (sidebarData.category !== 'uncategorized') count++;
    return count;
  };

  return (
    <div className='min-h-screen bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Header with Mobile Filter Button */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-white'>Discover Posts</h1>
            <p className='text-gray-400 mt-1 text-sm'>Find exactly what you're looking for</p>
          </div>
          
          {/* Mobile Filter Button */}
          <Button
            color="gray"
            className='lg:hidden bg-gray-800 hover:bg-gray-700 border-gray-700'
            onClick={() => setShowSidebar(true)}
          >
            <HiFilter className='w-4 h-4 mr-2' />
            Filters
            {filtersApplied && (
              <Badge color="purple" className='ml-2 px-1.5 py-0.5 text-xs'>
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar - Filters */}
          <div className={`lg:w-80 flex-shrink-0 ${
            showSidebar 
              ? 'fixed inset-0 z-50 bg-gray-900 p-4 overflow-y-auto' 
              : 'hidden lg:block'
          }`}>
            <div className='bg-gray-800 rounded-lg border border-gray-700 p-4 lg:sticky lg:top-6'>
              {/* Mobile Header */}
              {showSidebar && (
                <div className='flex items-center justify-between mb-4 lg:hidden'>
                  <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
                    <HiFilter className='w-5 h-5 text-purple-400' />
                    Filters
                  </h2>
                  <Button
                    color="gray"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className='bg-gray-700 hover:bg-gray-600'
                  >
                    <HiX className='w-4 h-4' />
                  </Button>
                </div>
              )}

              {/* Desktop Header */}
              {!showSidebar && (
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
                    <HiFilter className='w-5 h-5 text-purple-400' />
                    Filters
                  </h2>
                  {filtersApplied && (
                    <Badge color="purple" className='px-2 py-1 text-xs'>
                      {getActiveFiltersCount()} active
                    </Badge>
                  )}
                </div>
              )}

              <form className='space-y-4' onSubmit={handleSubmit}>
                {/* Search Input */}
                <div>
                  <label htmlFor='searchTerm' className='block text-sm font-medium text-gray-300 mb-2'>
                    Search Posts
                  </label>
                  <TextInput
                    icon={HiSearch}
                    placeholder='Type to search...'
                    id='searchTerm'
                    type='text'
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    className='w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500'
                    theme={{
                      field: {
                        input: {
                          base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500",
                        }
                      }
                    }}
                  />
                </div>

                {/* Sort Selection */}
                <div>
                  <label htmlFor='sort' className='block text-sm font-medium text-gray-300 mb-2'>
                    Sort By
                  </label>
                  <Select
                    id='sort'
                    value={sidebarData.sort}
                    onChange={handleChange}
                    className='w-full bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500'
                  >
                    <option value='desc' className='bg-gray-700'>Newest First</option>
                    <option value='asc' className='bg-gray-700'>Oldest First</option>
                  </Select>
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor='category' className='block text-sm font-medium text-gray-300 mb-2'>
                    Category
                  </label>
                  <Select
                    id='category'
                    value={sidebarData.category}
                    onChange={handleChange}
                    className='w-full bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500'
                  >
                    <option value='uncategorized' className='bg-gray-700'>All Categories</option>
                    <option value='reactjs' className='bg-gray-700'>React.js</option>
                    <option value='nextjs' className='bg-gray-700'>Next.js</option>
                    <option value='javascript' className='bg-gray-700'>JavaScript</option>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-2 pt-2'>
                  <Button
                    type='submit'
                    className='flex-1 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                  >
                    <HiSearch className='w-4 h-4 mr-2' />
                    Apply
                  </Button>
                  
                  {(filtersApplied || sidebarData.searchTerm || sidebarData.sort !== 'desc' || sidebarData.category !== 'uncategorized') && (
                    <Button
                      type='button'
                      color="gray"
                      onClick={handleClearFilters}
                      className='px-3 bg-gray-700 hover:bg-gray-600 border-gray-600'
                    >
                      <HiRefresh className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Main Content - Fixed layout */}
          <div className='flex-1'>
            {/* Results Header */}
            <div className='bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-lg font-semibold text-white'>
                    Search Results
                  </h2>
                  {!loading && (
                    <p className='text-gray-400 mt-1 text-sm'>
                      {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
                      {filtersApplied && ' with current filters'}
                    </p>
                  )}
                </div>
                
                {loading && (
                  <div className='flex items-center gap-2 text-purple-400'>
                    <Spinner size='sm' />
                    <span className='text-sm font-medium'>Searching...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Grid - Fixed to prevent collapsing */}
            {!loading && posts.length > 0 && (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start'>
                {posts.map((post) => (
                  <div 
                    key={post._id} 
                    className='bg-gray-800 rounded-lg border border-gray-700 overflow-hidden transition-all duration-200 hover:border-purple-500 min-h-[300px]'
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && posts.length === 0 && (
              <div className='bg-gray-800 rounded-lg border border-gray-700 p-8 text-center'>
                <HiSearch className='w-16 h-16 text-gray-600 mx-auto mb-4' />
                <h3 className='text-xl font-medium text-white mb-2'>No posts found</h3>
                <p className='text-gray-400'>
                  {filtersApplied 
                    ? 'Try adjusting your search criteria or filters'
                    : 'Start searching to discover posts'
                  }
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {[...Array(6)].map((_, index) => (
                  <div 
                    key={index} 
                    className='bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse min-h-[300px] flex flex-col'
                  >
                    <div className='flex-1 space-y-3'>
                      <div className='h-4 bg-gray-700 rounded w-3/4'></div>
                      <div className='h-3 bg-gray-700 rounded'></div>
                      <div className='h-3 bg-gray-700 rounded'></div>
                      <div className='h-3 bg-gray-700 rounded w-1/2'></div>
                      <div className='flex gap-2 mt-4'>
                        <div className='h-6 bg-gray-700 rounded w-16'></div>
                        <div className='h-6 bg-gray-700 rounded w-20'></div>
                      </div>
                    </div>
                    <div className='h-8 bg-gray-700 rounded mt-4'></div>
                  </div>
                ))}
              </div>
            )}

            {/* Show More Button */}
            {showMore && !loading && (
              <div className='text-center mt-8'>
                <Button
                  onClick={handleShowMore}
                  color="purple"
                  outline
                  className='px-8 py-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white'
                >
                  Load More Posts
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}