// components/Navbar.js
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../viewmodels/hooks/useAuthContext';
import { useLogout } from '../../viewmodels/hooks/useLogout';
import logo from '../../assets/learnup_logo.jpeg';
//styles & images
import './Navbar.css'


export default function Navbar({ onMenuClick }){
  
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()

  return (
    <div className='navbar'>
      <ul>
        {/* Bouton menu simple - toujours visible quand l'utilisateur est connecté */}
        {user && (
          <li>
            <button className='menu-button' onClick={onMenuClick}>
              Menu
            </button>
          </li>
        )}

        <li className='logo'>
          <img src={logo} alt="platforme logo"/>
          <span>LearnUp Platform</span>
        </li>

        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
          
        {user && (
          <li>
            {!isPending && <button className='btn' onClick={logout}>Logout</button>}
            {isPending && <button className='btn' disabled>Logging out...</button>}
          </li>
        )}
      </ul>
    </div>
  )
}