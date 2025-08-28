import { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 

  // Fetch current user to determine comment ownership
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${BASE_URL}/profile/api/users/me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCurrentUser(data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to view comments.');
          return;
        }
        const response = await fetch(`${BASE_URL}/profile/api/posts/${postId}/comments-list/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setComments(data.results || data); // Handle paginated or non-paginated response
        } else {
          setMessage(data.message || 'Failed to fetch comments.');
        }
      } catch (error) {
        setMessage('Error fetching comments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle comment creation
  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setMessage('Comment cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to add a comment.');
        return;
      }
      const response = await fetch(`${BASE_URL}/profile/api/posts/${postId}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (response.ok) {
        setComments([data, ...comments]); // Add new comment to the top
        setContent('');
        setMessage('');
      } else {
        setMessage(data.message || 'Failed to create comment.');
      }
    } catch (error) {
      setMessage('Error creating comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to delete a comment.');
        return;
      }
      const response = await fetch(`${BASE_URL}/profile/api/comments/${commentId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        setMessage('Comment deleted successfully.');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to delete comment.');
      }
    } catch (error) {
      setMessage('Error deleting comment. Please try again.');
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
      {message && <p className="text-red-500 text-sm mb-2 text-center">{message}</p>}
      {currentUser && (
        <form onSubmit={handleCreateComment} className="mb-4">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            maxLength="200"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400 resize-none"
            rows="2"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}
      {loading ? (
        <p className="text-center text-gray-600">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-600">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-start"
            >
              <div>
                <p className="text-gray-800 text-sm">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By {comment.author_username} on{' '}
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              {currentUser && currentUser.username === comment.author_username && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-600 hover:text-red-500 text-xs"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;