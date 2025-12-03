import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Industrial Deep Clean",
    desc: "Heavy-duty machinery degreasing, warehouse sanitization, and hazardous waste removal protocols.",
    longDesc: "Our Industrial Deep Clean service is engineered for large-scale facilities requiring rigorous hygiene standards. We tackle heavy oil buildup, chemical residues, and industrial byproducts using EPA-approved solvents and high-pressure steam systems. Ideal for factories, processing plants, and large storage facilities.",
    features: ["Heavy Machinery Degreasing", "Warehouse Sanitization", "Hazardous Waste Removal", "Compliance Reporting"],
    img: "/assets/hero-industrial.jpg",
    tag: "Enterprise"
  },
  {
    title: "Residential Sparkle",
    desc: "Detailed home cleaning, carpet steaming, and eco-friendly allergen reduction for your family.",
    longDesc: "Transform your home into a sanctuary with our Residential Sparkle package. We go beyond surface cleaning to eliminate deep-seated allergens, dust mites, and bacteria using HEPA-filtration vacuums and non-toxic, pet-safe cleaning agents. Perfect for move-ins, spring cleaning, or regular maintenance.",
    features: ["Deep Carpet Cleaning", "Allergen Reduction", "Eco-Friendly Products", "Pet & Child Safe"],
    img: "/assets/service-residential.jpg",
    tag: "Home"
  },
  {
    title: "Bio-Hazard Remediation",
    desc: "Certified cleanup for medical facilities, laboratories, and sensitive environments requiring sterility.",
    longDesc: "Specialized cleanup for critical environments where safety is paramount. Whether it's a medical laboratory, a chemical spill, or a sterile manufacturing zone, our certified technicians ensure complete decontamination. We utilize hospital-grade sterilizers and follow strict bio-containment protocols.",
    features: ["Medical Grade Sterilization", "Bio-waste Containment", "Certified Technicians", "24/7 Emergency Response"],
    img: "/assets/service-biohazard.jpg",
    tag: "Specialized"
  },
  {
    title: "Office Maintenance",
    desc: "Daily or weekly janitorial services to keep your workspace productive and professional.",
    longDesc: "Maintain a professional and productive workspace with our routine Office Maintenance services. We handle everything from daily trash removal and restroom sanitation to periodic deep cleaning of breakrooms and conference areas, ensuring your team works in a pristine environment.",
    features: ["Daily Janitorial", "Restroom Sanitation", "Breakroom Deep Clean", "Floor Care & Buffing"],
    img: "/assets/service-office.jpg",
    tag: "Commercial"
  }
];

import { staggerChildren } from '../utils/animations';
import ServiceDetail from './ServiceDetail';

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header text
      gsap.from(".service-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Animate cards with scale and fade
      gsap.fromTo(".service-card",
        {
          y: 50,
          opacity: 0,
          scale: 0.95
        },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Animate modal when it opens
  useEffect(() => {
    if (selectedService) {
      gsap.fromTo(".modal-content",
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
      );
    }
  }, [selectedService]);

  useEffect(() => {
    if (containerRef.current) {
      staggerChildren(containerRef.current, '.service-card');
    }
  }, []);

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="service-header text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Expertise</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Precision cleaning solutions tailored for every environment.</p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div key={idx} className="service-card group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 cursor-pointer" onClick={() => setSelectedService(s)}>
              <div className="aspect-w-16 aspect-h-9 h-64 w-full overflow-hidden">
                <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        {s.tag}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6">{s.desc}</p>
                </div>
                <button
                  onClick={() => setSelectedService(s)}
                  className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto outline-none focus:outline-none">
                    Learn More <span className="text-xl leading-none">&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedService && (
        <ServiceDetail
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onGetQuote={() => {
            setSelectedService(null);
            document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}
    </section>
  );
};

export default Services;
