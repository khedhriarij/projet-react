// context/AuthContext.js
import { createContext, useReducer, useEffect } from 'react'
import { projectAuth } from '../firebase/config'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log('🔄 AUTH CONTEXT: LOGIN action', action.payload)
      return { ...state, user: action.payload }
    case 'LOGOUT':
      console.log('🔄 AUTH CONTEXT: LOGOUT action')
      return { ...state, user: null }
    case 'AUTH_IS_READY':
      console.log('🔄 AUTH CONTEXT: AUTH_IS_READY', action.payload)
      return { user: action.payload, authIsReady: true }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    authIsReady: false
  })

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged(user => {
      console.log('🔥 Firebase Auth State Changed:', user)
      console.log('📸 PhotoURL:', user?.photoURL)
      console.log('👤 DisplayName:', user?.displayName)
      dispatch({ type: 'AUTH_IS_READY', payload: user })
      unsub()
    })
  }, [])

  console.log('🏠 AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )
}