import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Helper function to split the text into posts based on sentence length
const splitTextIntoPosts = (text, maxLength = 200) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g); // Match sentences based on punctuation
  let posts = [];
  let currentPost = "";

  sentences.forEach((sentence) => {
    if ((currentPost + sentence).length <= maxLength) {
      currentPost += sentence; // Add sentence to the current post
    } else {
      if (currentPost.trim()) {
        posts.push(currentPost.trim()); // Push the current post if it's not empty
      }
      currentPost = sentence; // Start a new post with the current sentence
    }
  });

  if (currentPost.trim()) {
    posts.push(currentPost.trim()); // Push the final post if there's any content
  }

  return posts;
};

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputText, setInputText] = useState(""); // State for text input
  const [posts, setPosts] = useState([]); // State for posts
  const [jumpIndex, setJumpIndex] = useState(""); // State for jump input
  const isScrolling = useRef(false);

  // Fetch the default text file and create posts on initial load
  useEffect(() => {
    const loadDefaultText = async () => {
      const response = await fetch("/defaultText.txt"); // Adjust path if necessary
      const text = await response.text();
      // Split text into posts based on sentence length
      const newPosts = splitTextIntoPosts(text);
      setPosts(newPosts.map((content, index) => ({
        id: index + 1,
        content,
        color: `bg-${['red', 'blue', 'green', 'yellow'][index % 4]}-500`,
      })));
    };

    loadDefaultText();
  }, []);

  const handleScroll = (e) => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const direction = e.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      posts.length - 1
    );

    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value); // Update the input text state
  };

  const handleSubmitText = () => {
    const newPosts = splitTextIntoPosts(inputText).map((text, index) => ({
      id: posts.length + index + 1,
      content: text,
      color: `bg-${['red', 'blue', 'green', 'yellow'][index % 4]}-500`,
    }));
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setInputText(""); // Clear the input after submitting
  };

  const handleJumpChange = (e) => {
    setJumpIndex(e.target.value); // Update the jump index input
  };

  const handleJumpSubmit = () => {
    const targetIndex = parseInt(jumpIndex, 10) - 1;
    if (targetIndex >= 0 && targetIndex < posts.length) {
      setCurrentIndex(targetIndex); // Jump to the selected post
    }
    setJumpIndex(""); // Clear the input after submission
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      onWheel={handleScroll}
    >
      <div className="relative h-full">
        {posts.map((post, index) => {
          const validPosts = posts.filter(post => post.content.trim() !== "");
          const postIndex = validPosts.findIndex(p => p.id === post.id) + 1;

          return (
            <motion.div
              key={post.id}
              initial={{ y: index > currentIndex ? "100%" : "-100%" }}
              animate={{
                y: index === currentIndex ? "0%" : index > currentIndex ? "100%" : "-100%",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute top-0 left-0 h-full w-full ${post.color} flex items-center justify-center`}
            >
              {index === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-4">
                  <h2 className="text-xl mb-4 font-medium">Enter Text to Update Posts:</h2>
                  <textarea
                    value={inputText}
                    onChange={handleTextChange}
                    rows="4"
                    className="p-2 bg-white text-black rounded border text-sm w-64"
                    placeholder="Type your text here..."
                  />
                  <button
                    onClick={handleSubmitText}
                    className="p-2 bg-blue-500 text-white rounded text-sm"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center text-white text-sm font-bold rounded-lg relative bg-gray-800"
                  style={{
                    minWidth: '250px',
                    minHeight: '250px',
                    maxWidth: '80vw',
                    maxHeight: '80vh',
                    padding: '20px',
                    borderRadius: '15px',
                    overflow: 'auto',
                  }}
                >
                  <div
                    className="absolute top-2 left-2 text-lg font-medium"
                    style={{ opacity: 0.5 }}
                  >
                    {`#${postIndex}`}
                  </div>
                  <div className="text-center">{post.content}</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
        <input
          type="number"
          value={jumpIndex}
          onChange={handleJumpChange}
          placeholder="Jump to Post"
          className="p-2 bg-gray-800 text-white rounded-lg text-sm border-none"
          style={{ width: '60px' }}
        />
        <button
          onClick={handleJumpSubmit}
          className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
        >
          <span className="text-xl">↑</span>
        </button>
      </div>
    </div>
  );
};

export default App;
