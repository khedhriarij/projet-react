import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import DashboardIcon from '../../assets/dashboard_icon.svg';
import AddIcon from '../../assets/add_icon.svg';
import DefaultAvatar from '../../assets/sofia.png';
import { useAuthContext } from '../../viewmodels/hooks/useAuthContext';

import { useAdmin } from '../../viewmodels/hooks/UseAdmin';
import Avatar from './Avatar';




export default function Sidebar({ isOpen, onClose }){
    const { user } = useAuthContext()
    const { isAdmin, loading } = useAdmin()

    if (!user || loading) {
        return null
    }

    const handleLinkClick = () => {
        onClose(); // Ferme la sidebar quand on clique sur un lien
    }

    return(
         <>
            {/* Overlay pour fermer la sidebar en cliquant à côté */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
            
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className='sidebar-content'>
                    <div className='user'>
                         <Avatar src={user.photoURL || DefaultAvatar} />
                         <p>Hey {user.displayName || user.email?.split('@')[0]} 👋</p>
                         <small style={{
                             fontSize: '0.8em', 
                             opacity: 0.7, 
                             display: 'block', 
                             marginTop: '5px',
                             textAlign: 'center'
                         }}>
                             {isAdmin ? 'Administrateur' : 'Étudiant'}
                         </small>
                    </div>
                    <nav className='links'>
                        <ul>
                            <li>
                                 <NavLink to="/catalog" end onClick={handleLinkClick}>
                                  <img src={DashboardIcon} alt='home icon'/>
                                   <span>Accueil</span>
                                 </NavLink>
                            </li>
                            
                            {/* Tableau de Bord - LIEN CORRIGÉ */}
                            {isAdmin ? (
                                <li>
                                    <NavLink to="/admin-dashboard" onClick={handleLinkClick}>
                                     <img src={DashboardIcon} alt='dashboard icon'/>
                                     <span>Tableau de Bord</span>
                                    </NavLink>
                                </li>
                            ) : (
                                <li>
                                    <NavLink to="/user-dashboard" onClick={handleLinkClick}>
                                     <img src={DashboardIcon} alt='dashboard icon'/>
                                     <span>Tableau de Bord</span>
                                    </NavLink>
                                </li>
                            )}
                            
                            {isAdmin && (
                                <li>
                                    <NavLink to="/create" onClick={handleLinkClick}>
                                     <img src={AddIcon} alt='add course icon'/>
                                     <span>Nouveau Cours</span>
                                    </NavLink>
                                </li>
                            )}
                            
                            {!isAdmin && (
                                <>
                                    <li>
                                        <NavLink to="/my-courses" onClick={handleLinkClick}>
                                         <img src={DashboardIcon} alt='my courses icon'/>
                                         <span>Mes Cours</span>
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
         </>
    )
}