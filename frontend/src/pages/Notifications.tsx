import React from 'react'
import SideBar from '../components/SideBar'

function Notifications() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SideBar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        Notifications
      </div>
    </div>
  )
}

export default Notifications
