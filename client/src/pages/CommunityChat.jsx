import React from 'react'
import MuiNavbar from '../components/MuiNavbar'
import Sidebar from '../components/MuiSidebar'
import Chat from '../components/Chat'

const CommunityChat = () => {
 
  return (
    <div>
    <div>
      <MuiNavbar></MuiNavbar>
    </div>
    <div className="hero">
    <div className="sidebar">
      <Sidebar></Sidebar>
    </div>
    <div className='chat'>
      <Chat> </Chat>
    </div>
    </div>
    </div>
);
}

export default CommunityChat