import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Facility Manager",
    company: "TechHub Industries",
    content: "D.O.C Wash & Clean transformed our production floor. The difference in air quality and overall cleanliness was noticeable immediately. Their team is professional, efficient, and thorough.",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff"
  },
  {
    name: "Michael Chen",
    role: "Homeowner",
    company: "Residential Client",
    content: "I've used several cleaning services before, but none compare to the detail D.O.C Wash & Clean puts in. They even got stains out of my carpet that I thought were permanent. Highly recommended!",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff"
  },
  {
    name: "Amara Okeke",
    role: "Operations Director",
    company: "Lagos Logistics",
    content: "Reliability is key for us, and D.O.C Wash & Clean delivers every single time. Their bio-hazard team handled a sensitive situation with absolute professionalism. A partner we trust.",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Amara+Okeke&background=F59E0B&color=fff"
  },
  {
    name: "David Smith",
    role: "Office Manager",
    company: "Creative Spaces",
    content: "Our office has never looked better. The daily maintenance crew is invisible but effective. It's a pleasure walking into a spotless workspace every morning.",
    rating: 4,
    avatar: "https://ui-avatars.com/api/?name=David+Smith&background=6366F1&color=fff"
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (slideRef.current) {
      gsap.fromTo(slideRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [currentIndex]);

  return (
    <section id="testimonials" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Trusted by Industry Leaders</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">Don't just take our word for it. Hear what our partners have to say.</p>
        </div>

        <div ref={containerRef} className="max-w-4xl mx-auto">
          <div className="relative bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 text-blue-500 opacity-20">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21L14.017 18C14.017 16.896 14.325 15.923 14.941 15.082C15.557 14.241 16.354 13.682 17.33 13.404V11.961C16.354 11.683 15.557 11.124 14.941 10.283C14.325 9.442 14.017 8.469 14.017 7.365V4.365H20.017V7.365C20.017 8.469 19.709 9.442 19.093 10.283C18.477 11.124 17.68 11.683 16.704 11.961V13.404C17.68 13.682 18.477 14.241 19.093 15.082C19.709 15.923 20.017 16.896 20.017 18V21H14.017ZM5.01697 21L5.01697 18C5.01697 16.896 5.32497 15.923 5.94097 15.082C6.55697 14.241 7.35397 13.682 8.32997 13.404V11.961C7.35397 11.683 6.55697 11.124 5.94097 10.283C5.32497 9.442 5.01697 8.469 5.01697 7.365V4.365H11.017V7.365C11.017 8.469 10.709 9.442 10.093 10.283C9.47697 11.124 8.67997 11.683 7.70397 11.961V13.404C8.67997 13.682 9.47697 14.241 10.093 15.082C10.709 15.923 11.017 16.896 11.017 18V21H5.01697Z" />
              </svg>
            </div>

            <div ref={slideRef} className="relative z-10 flex flex-col items-center text-center">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                className="w-20 h-20 rounded-full border-4 border-blue-500 mb-6 shadow-lg"
              />

              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 italic text-slate-200">
                "{testimonials[currentIndex].content}"
              </p>

              <div>
                <h4 className="text-lg font-bold text-white">{testimonials[currentIndex].name}</h4>
                <p className="text-blue-400 text-sm">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-700/50 hover:bg-blue-600 rounded-full transition-colors text-white hidden md:block"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-700/50 hover:bg-blue-600 rounded-full transition-colors text-white hidden md:block"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
