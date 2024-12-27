import React from 'react';
import './App.css';
import PostFeedSmart from './COMPONENTS/POSTFEED/PostFeedSmart';
import PostList from './COMPONENTS/POSTFEED/PostList';

function App() {
  return (
    <div className="App">
      <PostFeedSmart></PostFeedSmart>
      <PostList></PostList>
    </div>
  );
}

export default App;
