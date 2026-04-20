import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Definir la forma exacta de lo que devuelve la API
interface Categoria {
  categoria_id: number;
  categoria_name: string;
}

const Dashboard = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  //useEffect para cargar las categorias al montar el componente, SE JECUTA UNA SOLE VEZ AL CARGAR LA PANTALLA
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Peticion GET a la API para obtener las categorias, el tipo de dato que esperamos es un array de Categoria
        const response = await api.get<Categoria[]>('/categorias/all');
        setCategorias(response.data);
      } catch (err) {
        setError('Error al cargar las categorías');
      }
    };
    fetchCategorias();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); //Se borra token del localStorage
    navigate('/login'); //Redirige al login
  };

  // const handleHome = () => {
  //   navigate('/home');
  // };

  return (
    // 1. FONDO PRINCIPAL OSCURO CON LUCES FLOTANTES
    <div className="relative min-h-screen bg-[#0c121b] text-white p-4 sm:p-8 overflow-hidden font-sans">
      
      {/* Luces de Neón para el efecto Glassmorphism */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 2. CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER TIPO CRISTAL */}
        <header className="flex flex-col sm:flex-row justify-between items-center p-6 mb-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <h1 className="text-3xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-4 sm:mb-0 tracking-wide">
            PumQuiz!
          </h1>
          {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-bold">
            {error}
          </div>
        )}
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/leaderboard')}
              className="px-6 py-2 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 text-yellow-300 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all duration-300 font-bold shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
              🏆 Top 10
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
            >
              Salir
            </button>
          </div>
        </header>

        <h2 className="text-3xl font-bold mb-8 text-center text-white/90">
          ¿Qué tema dominarás hoy?
        </h2>

        {/* 3. GRID DE CATEGORÍAS TIPO CRISTAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <div 
              key={cat.categoria_id}
              onClick={() => navigate(`/categoria/${cat.categoria_id}`)}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2rem] transition-all duration-300 hover:bg-white/20 hover:-translate-y-2 hover:shadow-[0_15px_40px_0_rgba(0,0,0,0.4)] hover:border-white/40 cursor-pointer flex flex-col items-center justify-center text-center"
            >
              {/* Ícono de la categoría */}
              <div className="w-16 h-16 mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                🕹️
              </div>
              
              <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                {cat.categoria_name}
              </h3>
              
              <p className="text-white/50 text-sm mt-3 font-medium">
                Toca para explorar
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle-at-center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white p-8">
  //     <header className="max-w-7xl mx-auto flex justify-between items-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-12 shadow-2xl">
  //       <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">PumQuiz!</h1>

  //       {/* contenedor para agurpar botones */}
  //       <div className="flex gap-4">
  //         <button onClick={() => navigate('/leaderboard')}
  //           className="px-4 py-1 bg-amber-500/10 border border-amber-500/50 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-black transition-all font-bold"
  //           >
  //             Ranking
  //           </button> {/* Boton para ir al leaderboard */}

  //         <button onClick={handleLogout}
  //           className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-900 hover:text-white transition-all"
  //         >
  //           Cerrar Sesión 
  //         </button> {/* Boton para cerrar sesion */}
  //       </div>
  //     </header>

  //     <main className="max-w-7xl mx-auto">
  //       <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
  //         Selecciona tu desafio
  //       </h2>

  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  //         {categorias.map((cat) => (
  //           <div key={cat.categoria_id} 
  //             onClick={() => navigate(`/categoria/${cat.categoria_id}`)}
  //             className="group relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-cyan-500 hover:to-blue-600 transition-all cursor-pointer shadow-xl"
  //           >
  //             <div className="bg-slate-900 rounded-[22px] p-8 h-full flex flex-col justify-between items-center transition-all group-hover:bg-slate-900/80">
  //               <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
  //                 <span className="text-3xl">🎮</span>
  //               </div>
  //               <h3 className="text-2xl font-bold text-center group-hover:text-cyan-400 transition-colors">
  //                 {cat.categoria_name}
  //               </h3>
  //               <p className="text-slate-500 text-sm mt-2">Explora trivias epicas</p>
  //               <button className="mt-6 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white">
  //                 Explorar
  //               </button>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </main>
  //   </div>
  // );
}

export default Dashboard;