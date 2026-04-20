import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './GameView.css'


  // INTERFACES
interface Opcion {
  opcion_id: number
  opcion_texto: string
}

interface Pregunta {
  pregunta_id: number
  pregunta_texto: string
  opciones: Opcion[]
}

interface TriviaJuego {
  trivia_id: number
  trivia_titulo: string
  preguntas: Pregunta[]
}

interface Veredicto {
  es_correcta: boolean
  opcion_correcta_id: number
  puntos_ganados: number
}

const GameView = () => {
  const { id } = useParams() // Obtener el ID de la trivia desde la URL
  const navigate = useNavigate()

  //Estados que controlan el juego3
  const [trivia, setTrivia] = useState<TriviaJuego | null>(null)
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [puntosTotales, setPuntosTotales] = useState(0)
  const [juegoTerminado, setJuegoTerminado] = useState(false)

  // Estados visuales para el feedback
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null)
  const [opcionCorrecta, setOpcionCorrecta] = useState<number | null>(null)
  const [bloquearBotones, setBloquearBotones] = useState(false)

  // Al entrar a la pantalla, se carga la trivia desde la API usando el ID de la URL (la ciega)
  useEffect(() => {
    const fetchJuego = async () => {
      try {
        const respone = await api.get<TriviaJuego>(`/trivias/${id}/jugar`)
        setTrivia(respone.data)

      } catch (err) {
        alert('Error al cargar la trivia. Intenta recargar la página.')
        navigate('/dashboard') // Si hay error, redirige al home

      }
    }
    fetchJuego()
  }, [id, navigate]) // El useEffect se ejecuta cada vez que cambia el ID (si el usuario entra a otra trivia sin salir del juego)

  useEffect(() => {
    const guardarPuntos = async () => {
      // Solo se envia si el juego finaliza. Se convierte el id de la url en numero para enviarlo al backend
      if (juegoTerminado) {
        try {
          await api.post('/trivias/finalizar-partida', {
            trivia_id: Number(id),
            puntos: puntosTotales
          })
          console.log("Puntos guardados correctamente")
        } catch (err) {
          console.error("Error al guardar los puntos:", err)
        }
      }
    };
    guardarPuntos()
  }, [juegoTerminado, id, puntosTotales]) // El useEffect se ejecuta cada vez que cambia el estado de juegoTerminado

  const handleResponder = async (pregunta_id: number, opcion_id: number) => {
    setBloquearBotones(true) // Bloquea los botones para evitar múltiples respuestas
    setOpcionSeleccionada(opcion_id) // Marca la opción seleccionada para feedback visual

    try{
      const response = await api.post<Veredicto>(`/trivias/calificar`, {
        pregunta_id,
        opcion_id
      })
      const veredicto = response.data

      setTimeout(() => {
        // pintar de verde la op correcta
        setOpcionCorrecta(veredicto.opcion_correcta_id) // Marca la opción correcta para feedback visual
      
        // Sumar puntos si la respuesta es correcta
        if (veredicto.es_correcta) {
          setPuntosTotales((prev) => prev + veredicto.puntos_ganados)
        }
        // Esperar 2 segundos antes de pasar a la siguiente pregunta para mostrar el feedback (correcto/incorrecto)
        setTimeout(() => {
          // Limpiar colores de feedback
          setOpcionSeleccionada(null)
          setOpcionCorrecta(null)
          setBloquearBotones(false) // Desbloquea los botones para la siguiente pregunta

          // Pasar a la siguiente pregunta o terminar el juego si era la última
          if (trivia && indicePregunta < trivia.preguntas.length - 1) {
            setIndicePregunta((prev) => prev + 1)
          } else {
            setJuegoTerminado(true)
          }
        }, 500)
      },1500)

    } catch (err) {
      alert('Error al enviar la respuesta. Intenta de nuevo.')
      setBloquearBotones(false) // Desbloquea los botones para que el usuario pueda intentar responder de nuevo
    }
  }

  // 3. Controlador de clases
  const obtenerClaseBoton = (opcion_id: number) => {
    let clases = "btn-opcion "
    // 3.1 Usuario da click y empieza a correr 0.5s
    if (opcion_id === opcionSeleccionada && opcionCorrecta === null) {
      clases += "estado-seleccionado"
    }
    // 3.2 Se revela la respuesta
    if (opcionCorrecta !== null) {
      if (opcion_id === opcionCorrecta) {
        clases += "estado-correcto"
      } else if (opcion_id === opcionSeleccionada) {
        clases += "estado-incorrecto"
      }
    }

    return clases
  }

  // RENDERIZADO VISUAL
  if (!trivia) return (
    <div className="min-h-screen bg-[#0c121b] flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (juegoTerminado) {
    return (
      <div className="min-h-screen bg-[#0c121b] flex items-center justify-center p-6">
        <div className="absolute top-[-10%] left-[10%] w-96 h-96 bg-green-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 rounded-[3rem] text-center max-w-lg w-full shadow-2xl">
          <h1 className="text-6xl mb-4">🏆</h1>
          <h2 className="text-4xl font-black text-white mb-2">¡Increíble!</h2>
          <p className="text-white/60 text-xl mb-8">Has acumulado <span className="text-yellow-400 font-bold">{puntosTotales}</span> puntos</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-white text-blue-900 font-black rounded-2xl hover:scale-105 transition-transform"
          >
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    );
  }

  const preguntaActual = trivia.preguntas[indicePregunta]
  

  // =============ESTILO DEFAULT, SE RECOMIENDA MEJORARLO =============
  // return (
  //   <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
  //     <p style= {{ color: '#666', fontWeight: 'bold'}}>
  //       Pregunta {indicePregunta + 1} de {trivia.preguntas.length}
  //     </p>

  //     <h2 style = {{ marginBottom: '40px', fontSize: '28px'}}>Pregunta: {preguntaActual.pregunta_texto}</h2>

  //     <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap:'15px', maxWidth: '500px', margin: 'auto' }}>
  //       {preguntaActual.opciones.map((opcion) => (
  //           <button
  //             key={opcion.opcion_id}
  //             onClick={() => handleResponder(preguntaActual.pregunta_id, opcion.opcion_id)}
  //             disabled={bloquearBotones} // Deshabilita el botón si se están mostrando los resultados
  //             className={obtenerClaseBoton(opcion.opcion_id)}
  //             style={{border : opcionSeleccionada === opcion.opcion_id
  //               ? '2px solid #3498db' 
  //               : 'none',
  //               backgroundColor: opcionSeleccionada === opcion.opcion_id ? '#282d3d' : '#32394d',
  //               scale: opcionSeleccionada === opcion.opcion_id ? '.97' : '1',
  //             }}
  //             >
  //               {opcion.opcion_texto}
  //           </button>
  //       ))}
  //     </div>

  //     <h3 style={{ marginTop: '40px'}}>Puntos: {puntosTotales}</h3>

      
  //   </div>
  // )

  // =============ESTILO GLASSMORPHISM ============= by VSCODE
  // return (
  //   <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
  //     <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 rounded-[3rem] text-center max-w-lg w-full shadow-2xl">
  //       <h2 className="text-3xl font-bold text-white mb-4">
  //         Pregunta {indicePregunta + 1} de {trivia.preguntas.length}
  //       </h2>
  //       <p className="text-xl text-white/80 mb-8">{preguntaActual.pregunta_texto}</p>
  //       <div className="grid grid-cols-1 gap-6">
  //         {preguntaActual.opciones.map((opcion) => (
  //           <button
  //             key={opcion.opcion_id}
  //             onClick={() => handleResponder(preguntaActual.pregunta_id, opcion.opcion_id)}
  //             disabled={bloquearBotones}
  //             className={obtenerClaseBoton(opcion.opcion_id)}
  //           >
  //             {opcion.opcion_texto}
  //           </button>
  //         ))}
  //       </div>

  //       <p className="text-white/60 mt-8 text-lg">
  //         Puntos: <span className="text-yellow-400 font-bold">{puntosTotales}</span>
  //       </p>
        
  //     </div>
  //   </div>
  // );

  //glassmorphism by gemini
  return (
    // color: #0f172a
    <div className="min-h-screen bg-[#0c121b] relative overflow-hidden text-white font-sans p-4 sm:p-8">
      {/* Orbes de luz de fondo */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      {/* AGREGADO */}
      <div className="absolute top-[-10%] left-[10%] w-96 h-96 bg-green-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Barra de Progreso */}
        <div className="w-full bg-white/5 h-2 rounded-full mb-8 overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500"
            style={{ width: `${((indicePregunta + 1) / trivia.preguntas.length) * 100}%` }}
          ></div>
        </div>

        <header className="flex justify-between items-center mb-12">
          <span className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 text-sm font-bold">
            Pregunta {indicePregunta + 1} / {trivia.preguntas.length}
          </span>
          <span className="text-yellow-400 font-black text-xl">✨ {puntosTotales} pts</span>
        </header>

        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 leading-tight">
          {preguntaActual.pregunta_texto}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {preguntaActual.opciones.map((opcion) => {
            const esSeleccionada = opcion.opcion_id === opcionSeleccionada;
            const esCorrecta = opcion.opcion_id === opcionCorrecta;
            const mostrarError = esSeleccionada && opcionCorrecta !== null && !esCorrecta;
            
            return (
              <button
                key={opcion.opcion_id}
                onClick={() => handleResponder(preguntaActual.pregunta_id, opcion.opcion_id)}
                disabled={bloquearBotones}
                className={`
                  relative overflow-hidden p-6 text-xl font-medium rounded-3xl border transition-all duration-300
                  ${!bloquearBotones ? 'bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02]' : ''}
                  ${esSeleccionada && opcionCorrecta === null ? 'border-blue-400 bg-blue-400/10 scale-[0.98]' : ''}
                  ${esCorrecta ? 'bg-green-500/20 border-green-400 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.2)]' : ''}
                  ${mostrarError ? 'bg-red-500/20 border-red-400 text-red-300' : ''}
                  backdrop-blur-md
                `}
              >
                {opcion.opcion_texto}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

}

export default GameView
