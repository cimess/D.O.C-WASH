import React, { useState } from 'react';
import { findNearbyLocations } from '../services/geminiService';
import { GroundingChunk } from '../types';

const LocationFinder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<GroundingChunk['maps'][]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFindNearby = async () => {
    setLoading(true);
    setError(null);
    setLocations([]);

    try {
        if (!navigator.geolocation) {
            throw new Error("Geolocation is not supported by your browser");
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const result = await findNearbyLocations(position.coords.latitude, position.coords.longitude);
                    // Extract map chunks
                    const maps = result.chunks
                        .filter(c => c.maps)
                        .map(c => c.maps!);

                    if (maps.length === 0) {
                        setError("No nearby locations found by the AI.");
                    } else {
                        setLocations(maps);
                    }
                } catch (apiError) {
                    console.error(apiError);
                    setError("Failed to fetch location data from Gemini.");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("Unable to retrieve your location. Please allow location access.");
                setLoading(false);
            }
        );

    } catch (e: any) {
        setError(e.message);
        setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Find D.O.C Wash & Clean Partners Nearby</h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          We partner with top-tier supply stores and service centers. Use our AI map integration to find the closest verified partner to your current location.
        </p>

        <button
            onClick={handleFindNearby}
            disabled={loading}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg shadow hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto mb-10">
            {loading ? (
                "Locating..."
            ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Find Nearest Locations
                </>
            )}
        </button>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {locations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {locations.map((loc, i) => (
                    <div key={i} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-lg text-slate-900 mb-2 truncate">{loc.title}</h4>
                        <a
                            href={loc.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm hover:underline block mb-3">
                            View on Google Maps &rarr;
                        </a>
                        {/* If snippets exist, show one */}
                        {loc.placeAnswerSources?.[0]?.reviewSnippets?.[0] && (
                             <p className="text-xs text-slate-500 italic line-clamp-3">
                                "{loc.placeAnswerSources[0].reviewSnippets[0].content}"
                             </p>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default LocationFinder;
