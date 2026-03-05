import { motion } from "framer-motion";

export default function VolunteerSection() {
  return (
    <section className="bg-black text-white border-t border-b border-gray-900 mt-16">
      <div className="max-w-[1250px] mx-auto grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">

        <motion.div 
          whileHover={{ backgroundColor: "#111" }}
          transition={{ duration: 0.3 }}
          className="text-center py-24 px-10 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
             <div className="w-72 h-72 border-[12px] border-white rounded-b-full"></div>
          </div>
          <h3 className="text-[28px] font-serif mb-12 relative z-10 leading-snug">
            Inspire future students to choose<br/>WashU at college fairs.
          </h3>
          <button className="border border-white text-white text-[12px] font-bold tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300 relative z-10">
            Become a WashU Alumni Rep
          </button>
        </motion.div>

        <motion.div 
          whileHover={{ backgroundColor: "#111" }}
          transition={{ duration: 0.3 }}
          className="text-center py-24 px-10 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
             <div className="w-72 h-72 border-[12px] border-white rounded-b-full"></div>
          </div>
          <h3 className="text-[28px] font-serif mb-12 relative z-10 leading-snug">
            Share your time and talent with the<br/>WashU community.
          </h3>
          <button className="border border-white text-white text-[12px] font-bold tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300 relative z-10">
            Volunteer
          </button>
        </motion.div>

      </div>
    </section>
  );
}