import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import OnlyIssueInchargePrivateRoute from './components/OnlyIssueInchargePrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="sign-up" element={<SignUp/>}/>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home/>}/>
        </Route>

        {/* Issue Incharge Routes */} 
        <Route element={<OnlyIssueInchargePrivateRoute />}>
          
        </Route>

        {/* Admin Routes */}
        <Route element={<OnlyAdminPrivateRoute />}>
          
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
