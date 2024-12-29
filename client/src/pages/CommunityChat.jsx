import React from 'react';
import Layout from '../components/Layout';
import Chat from '../components/Chat';
import './CommunityChat.css';

const CommunityChat = () => {
  return (
    <Layout>
      <div className="chat-wrapper">
        <Chat />
      </div>
    </Layout>
  );
};

export default CommunityChat;