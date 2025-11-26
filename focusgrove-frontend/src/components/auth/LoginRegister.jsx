// src/pages/LoginRegister.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nickname: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setIsShaking(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 유효성 검사만! (shake)
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg('Invalid email format.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      if (isLogin) {
        const { email, password } = formData;
        const response = await api.post(endpoint, { email, password });
        localStorage.setItem('jwtToken', response.data.token);
        navigate('/dashboard');
      } else {
        const { nickname, email, password } = formData;
        await api.post(endpoint, { nickname, email, password });
        setIsLogin(true);
      }
    } catch (error) {
      setErrorMsg('Email or password is incorrect.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
      <div
          className="min-h-screen flex items-center justify-center px-4 text-white"
          style={{
            backgroundImage: `
        radial-gradient(at 15% 20%, hsla(260, 75%, 62%, 0.30) 0px, transparent 55%),
        radial-gradient(at 85% 25%, hsla(330, 80%, 70%, 0.25) 0px, transparent 55%),
        radial-gradient(at 75% 85%, hsla(200, 80%, 60%, 0.20) 0px, transparent 55%),
        radial-gradient(at 45% 70%, hsla(250, 60%, 55%, 0.18) 0px, transparent 60%)
      `,
            backgroundColor: "#07090d"
          }}
      >
        <div
            className={`
          w-full max-w-md
          backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl shadow-2xl
          p-8 transition duration-300
          ${isShaking ? 'animate-shake' : ''}
        `}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {errorMsg && (
              <p className="text-red-400 text-center text-sm mb-3 animate-pulse">
                {errorMsg}
              </p>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
                <div className="mb-5">
                  <label className="block text-gray-300 mb-1 text-sm">Nickname</label>
                  <input
                      type="text"
                      name="nickname"
                      onChange={handleChange}
                      className="
                      w-full p-3 rounded-xl
                      bg-white/10 backdrop-blur-lg border border-white/20 text-white
                      placeholder-gray-300/60 shadow-lg shadow-purple-500/10
                      focus:outline-none focus:border-pink-400
                      focus:shadow-[0_0_10px_rgba(236,72,153,0.45)]
                    "
                      required
                  />
                </div>
            )}

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-gray-300 mb-1 text-sm">Email</label>
              <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="
                  w-full p-3 rounded-xl
                  bg-white/10 backdrop-blur-lg border border-white/20 text-white
                  focus:outline-none focus:border-blue-400
                "
                  required
              />
            </div>

            {/* PASSWORD + SHOW/HIDE */}
            <div className="mb-6 relative">
              <label className="block text-gray-300 mb-1 text-sm">Password</label>

              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  className="
                  w-full p-3 rounded-xl
                  bg-white/10 backdrop-blur-lg border border-white/20 text-white
                  focus:outline-none focus:border-purple-400
                "
                  required
              />

              {/* 👁 아이콘 버튼 */}
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-300 hover:text-white"
              >
                {showPassword ? <HiEyeOff size={22}/> : <HiEye size={22}/>}
              </button>
            </div>

            <button
                type="submit"
                className="
              w-full py-3 rounded-xl text-lg font-bold
              {/*bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500*/}
              bg-custom-orange
              hover:scale-[1.02] active:scale-[0.98]
              transition duration-200 shadow-lg shadow-purple-500/20
            "
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full mt-6 text-sm text-gray-300 hover:text-white hover:underline"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
  );
};

export default LoginRegister;
