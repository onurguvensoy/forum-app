import React from 'react'
import { useParams } from 'react-router-dom'
import MuiNavbar from '../components/MuiNavbar'
import Sidebar from '../components/MuiSidebar'
import {useEffect,useState} from 'react'

const EntryDetail = () => {
const [data, setData] = useState({})
const {id} = useParams()
useEffect(() => {
  const fetchData = async () => {

    const response = await fetch(`http://localhost:4000/entries/${id}`)
    const data = await response.json()
    setData(data)
    console.log(data)
  }
  fetchData()
}
, [id])
  return (
    <div>      
      <div>
        <MuiNavbar></MuiNavbar>
      </div>
      <div className="hero">

      <div className="sidebar">
        <Sidebar></Sidebar>
      </div>
      <div className="content">
      {data.title}
      {data.content}
      {data.username}
      </div>
      </div>
    </div>
  )
}


export default EntryDetail