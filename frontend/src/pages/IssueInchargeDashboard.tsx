import React from 'react'
import SideBar from '../components/SideBar'

function IssueInchargeDashboard() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SideBar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        Issue Incharge Dashboard
      </div>
    </div>
  );
}
export default IssueInchargeDashboard
