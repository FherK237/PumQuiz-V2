import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

// DEFINICION DE LO QUE ESPERA EL BACKEND
interface JugadorTop {
  username: string
  puntos: number
}

const LeaderBoard = () => {
  const [jugadores, setJugadores] = useState<JugadorTop[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await api.get<JugadorTop[]>('/trivias/leaderboard/top')
        setJugadores(response.data)
      } catch (err) {
        setError('Error al cargar el leaderboard. Intenta recargar la página.')
      } finally {
        setLoading(false)
      }
    }

    fetchTop()

  }, []) // El useEffect se ejecuta solo una vez al cargar la página

  const getEstilosMedalla = (index: number) => {
    switch (index) {
      case 0: return { medalla: '🥇', corona: 'text-yellow-400', borde: 'border-yellow-400/50', fondo: 'bg-yellow-400/10' };
      case 1: return { medalla: '🥈', corona: 'text-gray-300', borde: 'border-gray-300/50', fondo: 'bg-gray-300/10' };
      case 2: return { medalla: '🥉', corona: 'text-amber-600', borde: 'border-amber-600/50', fondo: 'bg-amber-600/10' };
      default: return { medalla: `${index + 1}.`, corona: 'text-white/60', borde: 'border-white/10', fondo: 'bg-white/5' };
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white p-6 sm:p-10 overflow-hidden font-sans">
      
      {/* Fondo ambiental */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <span className="text-xl group-hover:-translate-x-1 inline-block transition-transform">⬅</span>
          </button>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
              TOP 10
            </h1>
            <p className="text-white/60">Los maestros absolutos de PumQuiz!</p>
          </div>
        </div>

        {/* Contenedor de la lista */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
          
          {loading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}

          {error && <p className="text-red-400 text-center py-10 font-bold">{error}</p>}
          
          {!loading && !error && jugadores.length === 0 && (
            <p className="text-white/50 text-center py-10 text-lg">
              Aún no hay partidas registradas. ¡Sé el primero en conquistar la cima!
            </p>
          )}

          <div className="flex flex-col gap-4">
            {jugadores.map((jugador, index) => {
              const estilos = getEstilosMedalla(index);
              
              return (
                <div 
                  key={index} 
                  className={`flex justify-between items-center p-5 rounded-2xl border ${estilos.borde} ${estilos.fondo} backdrop-blur-sm transition-all hover:scale-[1.01]`}
                >
                  <div className="flex items-center gap-5">
                    <span className={`text-3xl font-black w-10 text-center ${estilos.corona}`}>
                      {estilos.medalla}
                    </span>
                    <span className={`text-xl font-bold ${index < 3 ? 'text-white' : 'text-white/80'}`}>
                      {jugador.username}
                    </span>
                  </div>
                  <div className={`text-xl font-black tracking-wider ${index < 3 ? estilos.corona : 'text-cyan-400'}`}>
                    {jugador.puntos} <span className="text-sm font-medium text-white/50">pts</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default LeaderBoard