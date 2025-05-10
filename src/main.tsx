import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { AppWrapper } from './components/common/PageMeta.tsx'
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>

      <AuthProvider>
        <AppWrapper>
          <Toaster />
          <App />
        </AppWrapper>
      </AuthProvider>
      
    </ThemeProvider>
  </StrictMode>,
)
