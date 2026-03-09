import { useEffect } from 'react';
import { Compass } from 'lucide-react';
import { useWilayahMapping } from '@/hooks/useWilayahMapping';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const indonesiaBounds: LatLngBoundsExpression = [
    [-11.0, 94.0],
    [6.0, 141.0]
];

export default function MapSection() {
    const { statsKabupaten, isLoading, fetchStatsKabupaten } = useWilayahMapping();

    useEffect(() => {
        fetchStatsKabupaten();
    }, [fetchStatsKabupaten]);

    const totalKabupaten = statsKabupaten.length;
    const totalAlumni = statsKabupaten.reduce((sum, item) => sum + item.value, 0);

    return (
        <section className="py-24 bg-stone-900 text-[#FAF9F6] relative overflow-hidden">

            <style>{`
        .leaflet-container { background: #1c1917 !important; }
        .custom-map-tooltip {
          background-color: rgba(28, 25, 23, 0.95) !important;
          border: 1px solid rgba(59, 130, 246, 0.4) !important;
          border-radius: 4px;
          backdrop-filter: blur(4px);
          color: #FAF9F6 !important;
        }
        .custom-map-tooltip::before { display: none; }
      `}</style>

            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-16 items-center">

                <div className="lg:col-span-4 space-y-8 z-20 pointer-events-none">
                    <Compass size={40} className="text-[#3b82f6]" strokeWidth={1.5} />
                    <div className="space-y-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Peta Jaringan</span>
                        <h2 className="text-4xl lg:text-5xl font-serif tracking-tight leading-tight">
                            Jejak Kami <br /><span className="italic text-stone-400">Di Indonesia.</span>
                        </h2>
                        <p className="text-stone-400 font-serif text-lg leading-relaxed">
                            Menyebar luas mewarnai industri dari Sabang hingga Merauke.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-t border-stone-700 pt-8">
                        <div>
                            <p className="text-4xl font-serif text-[#FAF9F6]">
                                {isLoading ? '...' : totalKabupaten}<span className="text-[#3b82f6]">+</span>
                            </p>
                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-2">Kabupaten/Kota</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif text-[#FAF9F6]">
                                {isLoading ? '...' : totalAlumni}<span className="text-[#3b82f6]">+</span>
                            </p>
                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-2">Total Alumni</p>
                        </div>
                    </div>
                </div>

                {/* --- Bagian Peta (Kanan) --- */}
                <div className="lg:col-span-8 z-10">
                    <div className="border p-2 border-stone-300 bg-white rounded-sm shadow-xl shadow-stone-200/50">
                        <div className="aspect-video w-full relative overflow-hidden flex items-center justify-center bg-stone-100 rounded-sm">

                            <MapContainer
                                bounds={indonesiaBounds}
                                maxBounds={indonesiaBounds}
                                maxBoundsViscosity={1.0}
                                minZoom={4}
                                zoomControl={false}
                                className="w-full h-full outline-none z-10"
                            >
                                {/* 🌟 GANTI LAYER MENJADI "LIGHT_NOLABELS" */}
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                                />

                                {!isLoading && statsKabupaten.map((kab) => {
                                    
                                    if (kab.latitude && kab.longitude) {
                                        return (
                                            <CircleMarker 
                                                key={kab.id} 
                                                center={[kab.latitude, kab.longitude]} 
                                                radius={7} 
                                                pathOptions={{ 
                                                    color: '#1e3a8a',      // Garis tepi biru gelap
                                                    fillColor: '#3b82f6',  // Isi dalam biru terang
                                                    fillOpacity: 0.85,
                                                    weight: 2
                                                }}
                                            >
                                                <Tooltip direction="top" className="custom-map-tooltip" sticky>
                                                    <div className="text-center min-w-[100px]">
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 block mb-1">
                                                            {kab.name}
                                                        </span>
                                                        <span className="text-3xl font-serif text-[#adbeee] leading-none">
                                                            {kab.value}
                                                        </span> 
                                                        <span className="text-sm font-sans text-[#adbeee] italic"> Alumni</span>
                                                    </div>
                                                </Tooltip>
                                            </CircleMarker>
                                        );
                                    }
                                    
                                    return null;
                                })}
                            </MapContainer>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}