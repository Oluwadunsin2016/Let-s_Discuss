import React from 'react'
import ReactTimeAgo from 'react-time-ago'

const LastSeen = ({time}) => {
  return (
    <div>
    <ReactTimeAgo date={time} locale="en-US" />
    </div>
  )
}

export default LastSeen