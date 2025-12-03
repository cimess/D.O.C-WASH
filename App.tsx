import React from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import LiveAssistant from './components/LiveAssistant';
import SmartQuote from './components/SmartQuote';
import Testimonials from './components/Testimonials';
import ChatBot from './components/ChatBot';
import { fadeUp } from './utils/animations';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter text-slate-900 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            D.O.C<span className="text-blue-600">.</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#quote" className="hover:text-blue-600 transition-colors">Get Quote</a>
            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
            <a href="https://wa.me/2348158544009" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>
          <a href="https://wa.me/2348158544009" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors transform hover:scale-105">
            Book Now
          </a>
        </div>
      </header>

      <main>
        <section ref={(el) => el && fadeUp(el)}><Hero /></section>
        <section ref={(el) => el && fadeUp(el, 0.2)}><Services /></section>
        <section ref={(el) => el && fadeUp(el, 0.2)}><Testimonials /></section>
        <section ref={(el) => el && fadeUp(el, 0.2)}><LiveAssistant /></section>
        <section ref={(el) => el && fadeUp(el, 0.2)}><SmartQuote /></section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <h4 className="text-white font-bold text-lg mb-4">D.O.C Wash</h4>
             <p className="text-sm">Setting the new standard for industrial and residential hygiene through technology and expertise.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
                <li>Industrial Cleaning</li>
                <li>Residential Detail</li>
                <li>Bio-Hazard</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <p className="text-sm">1-800-DOC-WASH</p>
            <p className="text-sm">hello@docwash.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-xs">
            © {new Date().getFullYear()} D.O.C Wash Services. Powered by Gemini.
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default App;
