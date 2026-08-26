import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/appRouter'
import { AuthProvider } from './modules/auth/context/AuthContext'
import "bootstrap-icons/font/bootstrap-icons.css"
import { AlertProvider } from './context/AlertContext'
import { Alert } from './shared/components/Alert'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AlertProvider>
        <Alert />
        <RouterProvider router = {router} />
      </AlertProvider>
    </AuthProvider>
  </StrictMode>,
)
