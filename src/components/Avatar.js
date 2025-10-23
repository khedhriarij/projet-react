// components/Avatar.js
import './Avatar.css'
import DefaultAvatar from '../assets/sofia.png'

export default function Avatar({ src }) {
    console.log('🖼️ Avatar component - src:', src)
    
    return (
         <div className='avatar'>
             <img 
                 src={src || DefaultAvatar} 
                 alt="user avatar" 
                 onError={(e) => {
                     console.log('❌ Erreur de chargement de l\'avatar, utilisation par défaut', src)
                     e.target.src = DefaultAvatar
                 }}
             />
         </div>
    )
}