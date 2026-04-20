import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


interface LoginResponse {
  access_token: string;
  token_type: string;
}

const Login = () => {
  const [ email, setEmail] = useState<string>('');
  const [ password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    setError('');

    try {
      const response = await api.post<LoginResponse>('/login', {
        user_email: email,
        user_pass: password,
      });

      const token = response.data.access_token;

      localStorage.setItem('token', token);
      // alert('Login exitoso');
      navigate('/dashboard');

    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Correo o contraseña incorrectos");
        setLoading(false)
      } else {
        setError("Error de conexiónss");
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
        <p className="text-white/60 mb-8 font-medium">Inicia sesión para jugar</p>
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-bold">
            {error}
          </div>
        )}
      

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="text-left">
            <label className="block text-white/70 text-sm font-bold mb-2 ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-white/30"
            />
          </div>
          
          <div className="text-left mb-2">
            <label className="block text-white/70 text-sm font-bold mb-2 ml-1">Contraseña</label>
            <input 
              type="password" 
              placeholder="9assword123:$" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all placeholder-white/30"
            />
          </div>
          
          <button type="submit" disabled={loading}
          className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'CONECTANDO...' : 'ENTRAR AL JUEGO'}
          </button>
        </form>
        <p className="mt-8 text-white/50 text-sm">
          ¿No tienes cuenta? <span onClick={() => navigate("/register")} className="text-cyan-400 cursor-pointer font-bold hover:underline">Regístrate aquí</span>
        </p>
      </div>
    </div>
  );

};
export default Login;