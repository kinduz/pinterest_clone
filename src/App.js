import { BrowserRouter } from "react-router-dom"
import AppRouter from "./Routing/AppRouter"
import './styles/style.css'
import './firebase'

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App