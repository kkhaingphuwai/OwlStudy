import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreContext } from './components/store/StoreContext.ts'
import { rootStore } from './components/store/rootStore.ts'

createRoot(document.getElementById('root')!).render(
  <StoreContext.Provider value={rootStore}>
      <App />
  </StoreContext.Provider>
)
