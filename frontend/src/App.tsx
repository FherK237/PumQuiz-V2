import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TriviasView from './pages/TriviasView';
import GameView from './pages/GameView';
import LeaderBoard from './pages/LeaderBoard';
import Register from './pages/Register';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas predefinida */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas publicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas */}

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>

        <Route path="/categoria/:id" element={
          <ProtectedRoute>
            <TriviasView/>
          </ProtectedRoute>
        } />

        <Route path="/jugar/:id" element={
          <ProtectedRoute>
            <GameView/>
          </ProtectedRoute>
        } />

        <Route path='/leaderboard' element={
          <ProtectedRoute>
            <LeaderBoard/>
          </ProtectedRoute>
        } />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;