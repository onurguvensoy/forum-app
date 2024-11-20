import React from 'react'
import MuiNavbar from '../components/MuiNavbar'
import Sidebar from '../components/MuiSidebar'
import Form from '../components/Form'

const CreateEntry = () => {
  return (
        <div>
          <div>
            <MuiNavbar></MuiNavbar>
          </div>
          <div className="hero">
          <div className="sidebar">
            <Sidebar></Sidebar>
          </div>
          
          <div className='creatingform'>
            <Form></Form>
          </div>
          </div>
    
        </div>
      );
}

export default CreateEntry