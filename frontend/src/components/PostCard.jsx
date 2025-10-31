import { Link } from 'react-router';
import { useState } from 'react';

export default function PostCard({ post, loading = false }) {
  const [imageError, setImageError] = useState(false);

  // Loading skeleton
  if (loading) {
    return (
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-40 bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return '1 min';
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min`;
  };

  // Get excerpt from content
  const getExcerpt = (content, length = 80) => {
    if (!content) return '';
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > length 
      ? `${textContent.substring(0, length)}...` 
      : textContent;
  };

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200 overflow-hidden hover:scale-[1.02]">
      {/* Image Container */}
      <Link 
        to={`/post/${post.slug}`} 
        className="block relative overflow-hidden"
        aria-label={`Read ${post.title}`}
      >
        <div className="h-40 w-full overflow-hidden">
          {!imageError ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
              <div className="text-center text-teal-400">
                <svg className="w-8 h-8 mx-auto mb-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium">No Image</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Category Badge - Overlay on image */}
        <div className="absolute top-2 left-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-teal-500 text-white rounded-lg shadow-sm">
            {post.category}
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4">
        {/* Title */}
        <Link to={`/post/${post.slug}`} className="block mb-2">
          <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors duration-200 text-sm leading-tight mb-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-3">
          {getExcerpt(post.content)}
        </p>

        {/* Meta Information */}
        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span className="font-medium">{formatDate(post.createdAt)}</span>
          <div className="flex items-center gap-2">
            <span>{calculateReadingTime(post.content)}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <Link 
              to={`/post/${post.slug}`}
              className="text-teal-500 font-semibold hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              Read
              <svg 
                className="w-3 h-3 transition-transform group-hover:translate-x-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}