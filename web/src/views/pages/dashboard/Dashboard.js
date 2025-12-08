// pages/dashboard/Dashboard.js
import './dashboard.css'
// Retirez les imports de UltimateFirestoreTest et UserSyncDiagnostic
import OnlineUsers from '../../components/OnlineUsers'

export default function Dashboard(){  
    return(
         <div>
            <h1>🎯 Dashboard - Test Firestore</h1>
            
            {/* Retirez les composants manquants */}
            
            {/* Composant OnlineUsers original */}
            <div style={{ marginTop: '40px' }}>
              <h2>📱 Liste des Utilisateurs (OnlineUsers)</h2>
              <OnlineUsers />
            </div>
         </div>
    )
}