import { Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./lib/api";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Commission from "./pages/Commission";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import ComponentShowcase from "./pages/ComponentShowcase";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const { user: currentUser, loading: authLoading, logout } = useAuth();
  const [health, setHealth] = useState("checking...");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 检查健康状态
    api.get("/health")
      .then(res => setHealth(`Rails: ${res.data.status}`))
      .catch(err => setHealth(`Rails NG: ${err.message}`));
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/品牌 */}
            <div className="flex-shrink-0">
              <NavLink 
                to="/" 
                end
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                创作空间
              </NavLink>
            </div>
            
            {/* 桌面端导航链接 */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <div className="flex items-baseline space-x-8">
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  首页
                </NavLink>
                <NavLink 
                  to="/commission"
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  约稿
                </NavLink>
                <NavLink 
                  to="/articles"
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  文章列表
                </NavLink>
              </div>
              
              {/* 用户登录状态 */}
              <div className="flex items-center space-x-4">
                {authLoading ? (
                  <div className="text-sm text-gray-500">加载中...</div>
                ) : currentUser ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">欢迎, {currentUser.name}</span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      登出
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <NavLink
                      to="/login"
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      登录
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                    >
                      注册
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
            
            {/* 状态指示器和移动端菜单按钮 */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {health}
              </span>
              
              {/* 移动端菜单按钮 */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">打开主菜单</span>
                  {/* 汉堡菜单图标 */}
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <NavLink 
                to="/" 
                end
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                首页
              </NavLink>
              <NavLink 
                to="/commission"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                约稿
              </NavLink>
              <NavLink 
                to="/articles"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                文章列表
              </NavLink>
              
              {/* 移动端用户状态 */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {authLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">加载中...</div>
                ) : currentUser ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-700">
                      欢迎, {currentUser.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors duration-200"
                    >
                      登出
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <NavLink
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                    >
                      登录
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors duration-200"
                    >
                      注册
                    </NavLink>
                  </div>
                )}
              </div>
              
              <div className="px-3 py-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {health}
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* 主内容区域 */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/showcase" element={<ComponentShowcase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
