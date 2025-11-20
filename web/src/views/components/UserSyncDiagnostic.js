// components/UserSyncDiagnostic.js
import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'

export default function UserSyncDiagnostic() {
  const [firestoreUsers, setFirestoreUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const user = projectAuth.currentUser
      setCurrentUser(user)

      // Récupérer les users Firestore
      const snapshot = await projectFirestore.collection('users').get()
      const firestoreUsersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setFirestoreUsers(firestoreUsersData)

      setLoading(false)
    }

    fetchData()
  }, [])

  const syncCurrentUser = async () => {
    if (!currentUser) return

    const userData = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || currentUser.email.split('@')[0],
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      online: true,
      role: 'student',
      createdAt: new Date()
    }

    await projectFirestore.collection('users').doc(currentUser.uid).set(userData)
    alert('Utilisateur synchronisé!')
    window.location.reload()
  }

  const deleteTestUsers = async () => {
    const testUsers = firestoreUsers.filter(user => user.id.includes('sample-user-'))
    for (const user of testUsers) {
      await projectFirestore.collection('users').doc(user.id).delete()
    }
    alert(`${testUsers.length} utilisateurs test supprimés`)
    window.location.reload()
  }

  if (loading) return <div>Chargement...</div>

  const currentUserInFirestore = firestoreUsers.some(u => u.id === currentUser?.uid)

  return (
    <div style={{
      background: '#fff3cd',
      border: '2px solid #ffc107',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0'
    }}>
      <h3>🔧 Diagnostic Synchronisation Utilisateurs</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Utilisateur actuel (Auth):</h4>
        {currentUser ? (
          <div>
            <p><strong>UID:</strong> {currentUser.uid}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>DisplayName:</strong> {currentUser.displayName || 'Non défini'}</p>
            <p><strong>Dans Firestore:</strong> {currentUserInFirestore ? '✅' : '❌'}</p>
            {!currentUserInFirestore && (
              <button 
                onClick={syncCurrentUser}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Synchroniser cet utilisateur vers Firestore
              </button>
            )}
          </div>
        ) : (
          <p>Non connecté</p>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>Nettoyage:</h4>
        <button 
          onClick={deleteTestUsers}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Supprimer les utilisateurs de test
        </button>
        <p style={{ fontSize: '0.9em', marginTop: '5px' }}>
          {firestoreUsers.filter(user => user.id.includes('sample-user-')).length} utilisateur(s) test trouvé(s)
        </p>
      </div>

      <div>
        <h4>Utilisateurs dans Firestore ({firestoreUsers.length}):</h4>
        <ul style={{ maxHeight: '200px', overflow: 'auto', background: 'white', padding: '10px', borderRadius: '4px' }}>
          {firestoreUsers.map(user => (
            <li key={user.id} style={{ 
              padding: '5px 0',
              borderBottom: '1px solid #eee',
              color: user.id.includes('sample-user-') ? '#dc3545' : 'inherit'
            }}>
              <strong>{user.displayName || 'Sans nom'}</strong> ({user.email}) - {user.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}