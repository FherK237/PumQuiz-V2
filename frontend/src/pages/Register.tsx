import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"



const Register = () => {
  const [ formDataR, setFormDataR ] = useState({
    username: '',
    user_email: '',
    user_pass: '',
    user_birthdate: '',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataR({
      ...formDataR,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    setError(''); 

    try {
      await api.post('/register', {
        username: formDataR.username,
        user_email: formDataR.user_email,
        user_pass: formDataR.user_pass,
        user_birthdate: formDataR.user_birthdate
      });

      alert('Registro exitoso, ahora puedes iniciar sesión');
      navigate('/login');
      
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("El correo ya está registrado");
        setLoading(false)
      } else {
        setError("Error de conexión");
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0c121b] flex items-center justify-center p-4 overflow-hidden font-sans">

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2 italic">
          PumQuiz!
        </h1>
        <p className="text-white/60 mb-8 font-medium">¡Bienvenido! Crea una cuenta</p>
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-bold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="text-left">
          <label className="block text-white/70 text-sm font-bold mb-2 ml-1">Nombre de usuario</label>
            <input
              type="text"
              placeholder="usuarioPro777"
              name="username"
              value={formDataR.username}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-white/30"
            />
          </div>
          <div className="text-left mb-2">
          <label className="block text-white/70 text-sm font-bold mb-2 ml-1">Correo electronico</label>
            <input
              type="email"
              placeholder="ejemplo@example.com"
              name="user_email"
              value={formDataR.user_email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-white/30"
            />
          </div>
          <div className="text-left mb-2">
            <label className="block text-white/70 text-sm font-bold mb-2 ml-1">Contraseña</label>
            <input
              type="password"
              placeholder="9assword123:$"
              name="user_pass"
              value={formDataR.user_pass}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-white/30"
            />
          </div>
          <div className="text-left mb-2">
            <label className="block text-white/70 text-sm font-bold mb-2 ml-1">Fecha de nacimiento</label>
            <input
              type="date"
              placeholder="05/10/1999"
              name="user_birthdate"
              value={formDataR.user_birthdate}
              onChange={handleChange}
              required
              className="w-full  bg-white/5  border border-blue-500/80 text-gray-400/70 rounded-2xl p-4 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-white/30"
            />
          </div>

          <button type="submit" disabled={loading}
          className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-8 text-white/50 text-sm">
          ¿Ya tienes cuenta? <span onClick={() => navigate("/login")} className="text-cyan-400 cursor-pointer font-bold hover:underline">Inicia sesión aquí</span>
        </p>
      </div>
      
    </div>
  )
}

export default Register;
