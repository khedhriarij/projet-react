import Avatar from './Avatar'
import { useCollection } from '../../viewmodels/hooks/useCollection';
import { useAuthContext } from '../../viewmodels/hooks/useAuthContext';
import { useAdmin } from '../../viewmodels/hooks/UseAdmin'; // Import du hook admin
import './OnlineUsers.css'

export default function OnlineUsers(){
    const { error, documents } = useCollection('users')
    const { user: currentUser } = useAuthContext()
    const { isAdmin, loading } = useAdmin() // Vérification du statut admin

    // Si en cours de chargement ou si l'utilisateur n'est pas admin, ne rien afficher
    if (loading || !isAdmin) {
        return null
    }

    // 🔥 Récupère uniquement les utilisateurs en ligne
    const onlineUsers = documents
        ? documents.filter(user => user.online === true)
        : []

    return (
        <div className="user-list">
            <h2>Utilisateurs en ligne</h2>

            {error && <div className="error">{error}</div>}

            {onlineUsers.length > 0 ? (
                onlineUsers.map(user => (
                    <div key={user.id} className='user-list-item'>
                        <span className='online-user' />
                        
                        <span className="user-name">
                            {user.displayName || user.email?.split('@')[0]}
                            
                            {user.id === currentUser?.uid && (
                                <small className="you-label">(Vous)</small>
                            )}
                        </span>

                        <Avatar src={user.photoURL}/>
                    </div>
                ))
            ) : (
                <div className="no-users">
                    <p>Aucun utilisateur en ligne</p>
                </div>
            )}
        </div>
    )
}