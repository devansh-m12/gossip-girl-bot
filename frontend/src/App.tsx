import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Features from './pages/Features';
// import Pricing from './pages/Pricing';
import { ThemeProvider } from './components/theme-provider';
import Feed from './pages/feed';
import Chat from './pages/chat';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Navbar />
            </div>
          </div>
          <main className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/chat" element={<Chat />} />
                {/* <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} /> */}
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;