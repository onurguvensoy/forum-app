import React from 'react'
import { useParams } from 'react-router-dom'
import Entry from '../components/Entry'

const EntryDetail = () => {
    const { _id } = useParams()
  return (
    <div>
        <Entry _id={_id}/>
        
    </div>
  )
}

export default EntryDetail