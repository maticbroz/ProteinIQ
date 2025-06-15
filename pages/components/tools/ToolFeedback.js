import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ToolFeedback({ toolName }) {
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponseClick = (response) => {
    setSelectedResponse(response);
    setShowCommentBox(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName,
          helpful: selectedResponse === 'yes',
          comment: comment.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="my-16 pt-12 border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-600">Thank you for your feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16 pt-12 border-t border-gray-200">
      <div className="max-w-2xl mx-auto">
        {/* Feedback question - always visible */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <span className="text-sm text-gray-700">Was this page helpful?</span>

          <button
            onClick={() => handleResponseClick('yes')}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              selectedResponse === 'yes'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Yes
          </button>

          <button
            onClick={() => handleResponseClick('no')}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              selectedResponse === 'no'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            No
          </button>
        </div>

        {showCommentBox && (
          // Comment form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                {selectedResponse === 'yes'
                  ? 'Great! Any additional thoughts?'
                  : 'Sorry to hear that. How can we improve?'}
              </p>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional: Tell us more..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
