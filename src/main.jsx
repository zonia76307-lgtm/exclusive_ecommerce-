import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🔥 REDUX IMPORTS (Yeh lazmi hain)
import { Provider } from 'react-redux'
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ⚡ Provider ko yahan wrap karna hai taake poore App ko store mil sakay */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)