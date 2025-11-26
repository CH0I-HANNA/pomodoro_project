import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Aurora from './Aurora';


const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (

      /*

      <div className="absolute inset-0 -z-10">
          <Aurora
              colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
          />
      </div>*/

    <div
        className="min-h-screen text-white"


        style={{
            backgroundImage: `
    /* 메인 색감 유지 */
    radial-gradient(at 20% 18%, hsla(265, 70%, 58%, 0.28) 0px, transparent 60%), /* 퍼플 */
    radial-gradient(at 82% 25%, hsla(330, 75%, 62%, 0.22) 0px, transparent 62%), /* 핑크 */

    /* 라임 / 그린 최소량 (은은한 포인트) */
    radial-gradient(at 60% 15%, hsla(70, 95%, 62%, 0.10) 0px, transparent 50%),  /* 라임(상단 오른쪽) */
    radial-gradient(at 32% 78%, hsla(150, 75%, 52%, 0.12) 0px, transparent 65%), /* 그린(하단 왼쪽) */

    /* 블루 네온 + 연결톤 */
    radial-gradient(at 70% 82%, hsla(200, 75%, 55%, 0.22) 0px, transparent 60%), /* 블루 네온 */
    radial-gradient(at 42% 65%, hsla(250, 55%, 50%, 0.18) 0px, transparent 65%)  /* 퍼플-블루 연결 */
  `,
            backgroundColor: "#000000",
            backgroundSize: "cover",
        }}
      >


          <main className="p-8">
              {children}
          </main>
      </div>
  );
};

export default Layout;
