import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="w-full bg-white pt-6 pb-20 relative overflow-hidden">
      <div className="max-w-[1250px] mx-auto relative px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[75%] relative"
        >
          <div className="overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.7 }}
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
              alt="WashU Students"
              className="w-full h-[400px] lg:h-[650px] object-cover cursor-pointer"
            />
          </div>

          <div className="flex h-[60px] relative z-0">
            <div className="flex bg-white w-fit border-b border-l border-gray-200">
              <button className="px-6 border-r border-gray-200 hover:bg-[#a51417] hover:text-white group transition-colors duration-300 flex items-center justify-center">
                <Play size={16} className="fill-black group-hover:fill-white transition-colors" />
              </button>
              <button className="px-6 border-r border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">
                <ChevronLeft size={22} className="text-gray-700" />
              </button>
              <button className="px-6 hover:bg-gray-50 flex items-center justify-center transition-colors border-r border-gray-200">
                <ChevronRight size={22} className="text-gray-700" />
              </button>
            </div>
            <div className="flex-1 bg-[#285c4d]"></div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="hidden lg:block absolute right-8 bottom-12 w-[40%] bg-white pl-16 pt-20 pb-16 pr-8 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="mb-12">
            <svg width="65" height="80" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 L90 10 L90 60 C90 100 50 115 50 115 C50 115 10 100 10 60 Z" stroke="#a51417" strokeWidth="6" fill="white"/>
              <path d="M10 40 L90 40" stroke="#a51417" strokeWidth="6"/>
              <path d="M10 80 L90 80" stroke="#a51417" strokeWidth="6"/>
              <circle cx="28" cy="25" r="4.5" fill="#a51417"/>
              <circle cx="50" cy="25" r="4.5" fill="#a51417"/>
              <circle cx="72" cy="25" r="4.5" fill="#a51417"/>
              <circle cx="28" cy="95" r="4.5" fill="#a51417"/>
              <circle cx="50" cy="95" r="4.5" fill="#a51417"/>
              <circle cx="72" cy="95" r="4.5" fill="#a51417"/>
              <path d="M30 50 L50 58 L70 50 L70 68 L50 76 L30 68 Z" fill="white" stroke="#a51417" strokeWidth="5" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-[68px] font-serif text-[#111111] leading-[1.05] tracking-tight">
            Live your WashU, <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10">tomorrow.</span>
              <span className="absolute left-0 bottom-[12px] w-full h-[6px] bg-[#dcb439] -z-10"></span>
            </span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 250 }}
          transition={{ duration: 1 }}
          className="hidden lg:block absolute right-[22%] -bottom-[150px] w-[1px] bg-[#a51417] z-0"
        ></motion.div>

      </div>
    </section>
  );
}