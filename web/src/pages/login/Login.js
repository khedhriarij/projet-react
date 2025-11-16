// pages/login/Login.js
import { useState } from 'react'
import './login.css'
import { useLogin } from '../../hooks/useLogin'

export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isPending} = useLogin() 

    const handleSubmit = (e) => {
        e.preventDefault()
        login(email, password)
    }
    
    return(
         <div className="login-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Connexion</h2>
                <label>
                    <span>Email:</span>
                    <input
                        required 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email}
                        placeholder="votre@email.com"
                    />
                </label>
                <label>
                    <span>Mot de passe:</span>
                    <input
                        required
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password}
                        placeholder="Votre mot de passe"
                    />
                </label>
                {!isPending && <button className="btn">Se connecter</button>}
                {isPending && <button className="btn" disabled>Chargement...</button>}
                {error && <div className="error">{error}</div>}
            </form>
         </div>
    )
}