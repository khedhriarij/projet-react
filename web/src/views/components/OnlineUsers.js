// components/OnlineUsers.js - VERSION CORRIGÉE

import Avatar from './Avatar'
import { useCollection } from '../../viewmodels/hooks/useCollection';
import { useAuthContext } from '../../viewmodels/hooks/useAuthContext';
import './OnlineUsers.css'

export default function OnlineUsers(){
    const { error, documents } = useCollection('users')
    const { user: currentUser } = useAuthContext() // Utilisateur actuellement connecté
    
    console.log('=== ONLINE USERS DEBUG ===')
    console.log('Tous les utilisateurs:', documents)
    console.log('Utilisateur connecté:', currentUser)

    // 🔥 FILTRE : Seulement l'utilisateur actuellement connecté
    const connectedUser = documents ? documents.find(user => user.id === currentUser?.uid) : null

    return (
        <div className="user-list">
            <h2>Utilisateur Connecté</h2>
            {error && <div className="error">{error}</div>}
            
            {connectedUser ? (
                <div key={connectedUser.id} className='user-list-item'>
                    {/* Toujours vert car c'est l'utilisateur connecté */}
                    <span className='online-user' title="Vous êtes connecté"></span>
                    <span className="user-name">
                        {connectedUser.displayName || connectedUser.email?.split('@')[0]}
                        <small style={{display: 'block', fontSize: '0.8em', color: '#666'}}>
                            (Vous)
                        </small>
                    </span>
                    <Avatar src={connectedUser.photoURL}/>
                </div>
            ) : currentUser ? (
                // Si l'utilisateur est connecté mais pas dans Firestore
                <div className='user-list-item'>
                    <span className='online-user' title="Vous êtes connecté"></span>
                    <span className="user-name">
                        {currentUser.displayName || currentUser.email?.split('@')[0]}
                        <small style={{display: 'block', fontSize: '0.8em', color: '#666'}}>
                            (Vous - profil en cours de chargement)
                        </small>
                    </span>
                    <Avatar src={currentUser.photoURL}/>
                </div>
            ) : (
                <div className="no-users">
                    <p>Aucun utilisateur connecté</p>
                </div>
            )}
        </div>
    )
}