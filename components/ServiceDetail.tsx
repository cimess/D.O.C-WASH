import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Service {
  title: string;
  desc: string;
  longDesc: string;
  features: string[];
  img: string;
  tag: string;
}

interface ServiceDetailProps {
  service: Service;
  onClose: () => void;
  onGetQuote: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose, onGetQuote }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
      );
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
          <img
            src={service.img}
            alt={service.title}
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
          <div className="absolute bottom-4 left-4 md:hidden">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
              {service.tag}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/5 p-8 md:p-12 bg-white">
          <div className="hidden md:block mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {service.tag}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{service.title}</h2>

          <div className="prose prose-slate mb-8">
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {service.longDesc}
            </p>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Key Features
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button
              onClick={onGetQuote}
              className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-center"
            >
              Get a Quote
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
