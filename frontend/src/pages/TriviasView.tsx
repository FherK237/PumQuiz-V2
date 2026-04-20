import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Trivia {
  trivia_id: number;
  trivia_titulo: string;
  dificultad: string;
  trivia_descripcion: string;
  num_preguntas: number; // Campo de enumerar trivias, se obtiene del backend con un conteo de preguntas asociadas a cada trivia
}

const TriviasView = () => {
  const { id } = useParams(); // Extraer el id de la categoria desde la URL
  const navigate = useNavigate();

  const [trivias, setTrivias] = useState<Trivia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTrivias = async () => {
      try {
        const response = await api.get<Trivia[]>(`/trivias/categoria/${id}`);
        setTrivias(response.data);
        setError('');
      } catch (err: any) {
        // Se devuelve 404 si la categoria esta vacia
        if (err.response && err.response.status === 404) {
          setError('Aun no hay trivias para esta categoria. ¡Vuelve pronto!');
          setTrivias([]);
        } else {
          setError('Error al cargar las trivias');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrivias();
  }, [id]); // Si el id cambia, se vuelve a ejecutar el useEffect para cargar las trivias de la nueva categoria


  //==============RENDERIZADO DEFAULT================
  // return (
  //   <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto' }}>
  //     <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px',cursor: 'pointer'}}>
  //     ⬅  Volver a Dashboard
  //     </button>

  //     <h2>Selecciona una Trivia</h2>

  //     {loading && <p>Cargando trivias...</p>}
  //     {error && <p style={{ color: 'gray', fontStyle: 'italic' }}>{error}</p>}

  //     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
  //       {trivias.map((trivia) => (
  //         <div key={trivia.trivia_id} style={{ border: '2px solid #2a82ae', padding: '20px', borderRadius: '10px'}}>
  //           <h3 style={{ margin: '0 0 10px 0'}}>{trivia.trivia_titulo}</h3>
  //           <p style={{ margin: '5px 0', fontSize: '14px', color: '#555'}}>{trivia.trivia_descripcion}</p>

  //           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '12px', fontWeight: 'bold' }}>
  //             <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '5px', color: 'black' }}>
  //               Dificultad: {trivia.dificultad}
  //             </span>
  //             <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '5px', color: 'black' }}>
  //               Preguntas: {trivia.num_preguntas}
  //             </span>
  //           </div>

  //           <button onClick={() => navigate(`/jugar/${trivia.trivia_id}`)}
  //           style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#000000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
  //             Jugar
  //           </button>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // )

  return (
    <div className="relative min-h-screen bg-[#0c121b] text-white p-6 sm:p-10 overflow-hidden font-sans">
      
      {/* Decoración de fondo */}
      <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Botón Volver y Título */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <span className="text-xl group-hover:-translate-x-1 inline-block transition-transform">⬅</span>
            </button>
            <h2 className="text-4xl font-black tracking-tight text-white/90">
              Desafíos Disponibles
            </h2>
          </div>
          
          <div className="px-5 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full text-blue-300 text-sm font-bold">
            {trivias.length} Trivias encontradas
          </div>
        </div>

        {/* Estados de Carga y Error */}
        {loading && (
          <div className="flex justify-center mt-20">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-white/10 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] text-center">
            <p className="text-white/60 text-lg italic">{error}</p>
          </div>
        )}

        {/* Grid de Trivias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {trivias.map((trivia) => (
            <div 
              key={trivia.trivia_id}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] transition-all duration-500 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              {/* Brillo al hacer hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]"></div>

              <div className="relative">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold group-hover:text-blue-300 transition-colors">
                    {trivia.trivia_titulo}
                  </h3>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-black uppercase tracking-widest text-white/40">
                    ID: {trivia.trivia_id}
                  </span>
                </div>

                <p className="text-white/60 leading-relaxed mb-8">
                  {trivia.trivia_descripcion || "Pon a prueba tus conocimientos en esta trivia temática diseñada para expertos."}
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm">
                    <span className="text-blue-400">🧠</span> {trivia.dificultad}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm">
                    <span className="text-cyan-400">📝</span> {trivia.num_preguntas} Preguntas
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/jugar/${trivia.trivia_id}`)}
                className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                ¡ACEPTAR EL RETO!
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TriviasView;

