import React from 'react'
import { Link } from 'react-router-dom'

const Panel = () => {
  return (
    <>
      <h1>Панель управления</h1>
      <Link to="/add-card">Добавить товар</Link>
    </>
  )
}

export default Panel