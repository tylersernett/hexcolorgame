import React from 'react'

const Stats = ({ score, streak }) => {
    return (
        <div className='stats'>
            <div className='stats-block' id='score' >Score: {score}</div>
            <div className='stats-block' id='pipe'>⁄⁄</div>
            <div className='stats-block' id='streak'>Streak: {streak}</div>
        </div>
    )
}

export default Stats