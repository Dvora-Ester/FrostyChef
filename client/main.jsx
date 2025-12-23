import React from 'react'
import ReactDOM from 'react-dom/client'
import ChefMirror from './App.jsx' // שימי לב לסיומת .jsx ולשם הקובץ
import './App.css'                // ייבוא העיצוב הכללי

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChefMirror />
  </React.StrictMode>
)
