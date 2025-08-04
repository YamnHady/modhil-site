import React from 'react'
import './Home.css'
import Highlight from '../../Components/Highlight/Highlight'
import News from '../../Components/News/News'

const Home = () => {
  return (
    <div>
        <div>
            <Highlight/>
        </div>
        <div>
            <News/>
        </div>
    </div>
  )
}

export default Home