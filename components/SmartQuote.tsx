import React, { useState } from 'react';
import { generateSmartQuote } from '../services/geminiService';
import { QuoteResponse } from '../types';
// import emailjs from 'emailjs-com';

const SmartQuote: React.FC = () => {
  const [details, setDetails] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    setLoading(true);
    try {
      const result = await generateSmartQuote(details);
      setQuote(result);

      // Send email notification (Disabled for now - using WhatsApp)
      /*
      emailjs.send('service_g0vaa3l', 'YOUR_TEMPLATE_ID', {
        to_name: "Admin",
        from_name: "Smart Quote AI",
        message: `New Quote Request:\n\nDetails: ${details}\n\nEstimate: ₦${result.estimatedCost}\nDuration: ${result.estimatedTime}`,
        reply_to: "customer@example.com" // You might want to add an email input field to the form
      }, 'YOUR_PUBLIC_KEY')
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
         console.log('FAILED...', err);
      });
      */

    } catch (err) {
      console.error("Smart Quote Error:", err);
      alert(`Error generating quote: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quote" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Get a Smart Quote</h2>
          <p className="text-slate-600 mt-2">Describe your cleaning needs (e.g., "5000sqft warehouse with oil spills" or "3 bedroom apartment move-out clean") and our AI will estimate the job.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="E.g., I have a 2-story office building, approx 2000 sq ft. Needs carpet cleaning and window washing. Located in downtown."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !details}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? (
                    <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Request...
                    </>
                ) : (
                    "Generate AI Estimate"
                )}
              </button>
            </form>

            {quote && (
              <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="bg-blue-50 p-6 rounded-xl text-center">
                        <span className="block text-sm text-blue-600 font-semibold uppercase tracking-wide">Estimated Cost</span>
                        <span className="block text-4xl font-bold text-slate-900 mt-2">₦{quote.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl text-center">
                        <span className="block text-sm text-green-600 font-semibold uppercase tracking-wide">Estimated Duration</span>
                        <span className="block text-4xl font-bold text-slate-900 mt-2">{quote.estimatedTime}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-900 mb-2">Recommended Services:</h4>
                        <div className="flex flex-wrap gap-2">
                            {quote.recommendedServices.map((s, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-2">AI Reasoning:</h4>
                        <p className="text-slate-600 italic text-sm border-l-4 border-blue-500 pl-4">{quote.reasoning}</p>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <a href="https://wa.me/2348158544009" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-md">
                        Book on WhatsApp (08158544009) &rarr;
                    </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartQuote;
