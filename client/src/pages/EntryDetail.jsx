import React from 'react'
import { useParams } from 'react-router-dom'

const EntryDetail = () => {
    const { _id } = useParams()
  return (
    <div>{_id}</div>
  )
}

export default EntryDetail