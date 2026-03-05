import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { AuthProvider } from './features/auth/context/AuthContext.tsx'
import { QueryProvider } from './app/providers/QueryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryProvider>,
)
