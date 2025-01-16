import React from 'react'
import AdminSidebar from '../components/AdminSidebar'

function ManageUsers() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <AdminSidebar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">Manage Users</div>
    </div>
  )
}

export default ManageUsers
