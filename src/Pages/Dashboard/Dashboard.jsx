import React from 'react'
import './Dashboard.css'
import HighlightControl from '../../Components/HighlightControl/HighlightControl.jsx'
import PartnerControl from '../../Components/PartnerControl/PartnerControl.jsx'
import NewsControl from '../../Components/NewsControl/NewsControl.jsx'

const Dashboard = () => {
  return (
    <div className='d-sction'>
        <div >
        <HighlightControl />
        </div>
        <div >
          <PartnerControl />
        </div>
        <div>
          <NewsControl />
        </div>
    </div>
  )
}

export default Dashboard