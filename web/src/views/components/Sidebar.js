import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import DashboardIcon from '../../assets/dashboard_icon.svg';
import AddIcon from '../../assets/add_icon.svg';
import DefaultAvatar from '../../assets/sofia.png';
import { useAuthContext } from '../../viewmodels/hooks/useAuthContext';
import { useAdmin } from '../../viewmodels/hooks/UseAdmin';
import Avatar from './Avatar';
import UserRoleBadge from '../User/UserRoleBadge';

// Icônes SVG améliorées
const CertificateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 3C2.89 3 2 3.89 2 5V15C2 16.11 2.89 17 4 17H12V15H4V5H20V15H18V17H20C21.11 17 22 16.11 22 15V5C22 3.89 21.11 3 20 3H4M8 5H14V7H8V5M8 7H14V9H8V7M8 9H14V11H8V9M8 11H14V13H8V11M16 5H18V7H16V5M16 7H18V9H16V7M16 9H18V11H16V9M16 11H18V13H16V11M12 15V18H15V20H12V23L8 21L12 19V15Z"/>
  </svg>
);

const GraduationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 17.18 8 16 12 16C16 16 19 17.18 19 17.18V13.18L12 17L5 13.18Z"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18,22A2,2 0 0,0 20,20V4C20,2.89 19.1,2 18,2H12V9L9.5,7.5L7,9V2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18Z"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>
);

export default function Sidebar({ isOpen, onClose }) {
    const { user } = useAuthContext();
    const { isAdmin, loading } = useAdmin();
    const navigate = useNavigate();

    if (!user || loading) {
        return null;
    }

    const handleLinkClick = () => {
        onClose();
    };

    const handleAvatarClick = () => {
        navigate('/profile');
        onClose();
    };

    return(
         <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
            
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className='sidebar-content'>
                    {/* Header avec dégradé */}
                    <div className='sidebar-header'>
                        <div className='user-info'>
                            <div className='avatar-container'>
                                <div className='avatar-clickable' onClick={handleAvatarClick}>
                                    <Avatar src={user.photoURL || DefaultAvatar} />
                                    <div className='status-indicator'></div>
                                </div>
                            </div>
                            <div className='user-details'>
                                <p className='user-greeting'>Bonjour {user.displayName || user.email?.split('@')[0]} 👋</p>
                                {/* REMPLACEMENT : UserRoleBadge au lieu du texte simple */}
                                <UserRoleBadge 
                                    role={isAdmin ? 'admin' : 'student'} 
                                    size="small"
                                    showIcon={true}
                                    showLabel={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className='sidebar-nav'>
                        <div className='nav-section'>
                            <h3 className='section-title'>Navigation Principale</h3>
                            <ul>
                                <li>
                                    <NavLink to="/catalog" end onClick={handleLinkClick} className="nav-link">
                                        <div className='nav-icon'>
                                            <img src={DashboardIcon} alt='home icon'/>
                                        </div>
                                        <span>Accueil</span>
                                        <div className='nav-arrow'>›</div>
                                    </NavLink>
                                </li>
                                
                                {/* Lien vers le profil */}
                                <li>
                                    <NavLink to="/profile" onClick={handleLinkClick} className="nav-link">
                                        <div className='nav-icon'>
                                            <ProfileIcon />
                                        </div>
                                        <span>Mon Profil</span>
                                        <div className='nav-arrow'>›</div>
                                    </NavLink>
                                </li>
                                
                                {/* Tableau de Bord */}
                                {isAdmin ? (
                                    <li>
                                        <NavLink to="/admin-dashboard" onClick={handleLinkClick} className="nav-link">
                                            <div className='nav-icon'>
                                                <img src={DashboardIcon} alt='dashboard icon'/>
                                            </div>
                                            <span>Tableau de Bord</span>
                                            <div className='nav-arrow'>›</div>
                                        </NavLink>
                                    </li>
                                ) : (
                                    <li>
                                        <NavLink to="/user-dashboard" onClick={handleLinkClick} className="nav-link">
                                            <div className='nav-icon'>
                                                <img src={DashboardIcon} alt='dashboard icon'/>
                                            </div>
                                            <span>Tableau de Bord</span>
                                            <div className='nav-arrow'>›</div>
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Section Étudiant */}
                        {!isAdmin && (
                            <div className='nav-section'>
                                <h3 className='section-title'>Mes Espaces</h3>
                                <ul>
                                    <li>
                                        <NavLink to="/certificates" onClick={handleLinkClick} className="nav-link">
                                            <div className='nav-icon'>
                                                <CertificateIcon />
                                            </div>
                                            <span>Mes Certificats</span>
                                            <div className='nav-arrow'>›</div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/my-courses" onClick={handleLinkClick} className="nav-link">
                                            <div className='nav-icon'>
                                                <BookIcon />
                                            </div>
                                            <span>Mes Cours</span>
                                            <div className='nav-arrow'>›</div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Section Admin */}
                        {isAdmin && (
                            <div className='nav-section'>
                                <h3 className='section-title'>Administration</h3>
                                <ul>
                                    <li>
                                        <NavLink to="/create" onClick={handleLinkClick} className="nav-link">
                                            <div className='nav-icon'>
                                                <img src={AddIcon} alt='add course icon'/>
                                            </div>
                                            <span>Nouveau Cours</span>
                                            <div className='nav-arrow'>›</div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/users" onClick={handleLinkClick} className="nav-link">
                                            <div className='nav-icon'>
                                                <GraduationIcon />
                                            </div>
                                            <span>Gestion Utilisateurs</span>
                                            <div className='nav-arrow'>›</div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </nav>

                    {/* Footer de la sidebar */}
                    <div className='sidebar-footer'>
                        <div className='platform-info'>
                            <div className='platform-logo'>🎓</div>
                            <div className='platform-text'>
                                <p className='platform-name'>EduPlatform</p>
                                <p className='platform-version'>Version 2.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </>
    );
}