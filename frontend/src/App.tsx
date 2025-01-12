import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import OnlyIssueInchargePrivateRoute from './components/OnlyIssueInchargePrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import Profile from './pages/Profile'
import ComplaintPage from './pages/ComplaintPage'
import RoleBasedRoute from './components/RoleBasedRoute'
import IssueInchargeDashboard from './pages/IssueInchargeDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="sign-up" element={<SignUp/>}/>
        <Route path="/role-redirect" element={<RoleBasedRoute />} />
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/complaint/:complaintId' element={<ComplaintPage />}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>

        {/* Issue Incharge Routes */} 
        <Route element={<OnlyIssueInchargePrivateRoute />}>
        <Route
          path="/issue-incharge/dashboard"
          element={<IssueInchargeDashboard />}
        />
        </Route>

        {/* Admin Routes */}
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="/not-authorized" element={<div>Not Authorized</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
