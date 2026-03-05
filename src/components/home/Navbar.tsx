import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white relative z-50 shadow-sm"
    >
      <div className="h-1.5 w-full bg-[#a51417]"></div>

      <div className="border-b border-gray-100">
        <div className="max-w-[1250px] mx-auto flex justify-end gap-6 py-2 px-6 lg:px-8 text-[11px] font-bold tracking-widest text-[#a51417] uppercase">
          {["Events", "News & Awards", "Resources", "About", "Contact Us"].map((item, idx) => (
            <a key={idx} href="#" className="hover:text-black transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-[1250px] mx-auto flex items-center justify-between py-5 px-6 lg:px-8">
        <a href="#" className="flex items-center group">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Washington_University_in_St._Louis_Logo.png"
            alt="WashU Logo"
            className="h-10 object-contain transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="h-8 w-[1px] bg-gray-300 mx-5"></div>
          <span className="text-[22px] font-light text-gray-800 tracking-wide group-hover:text-[#a51417] transition-colors duration-300">
            Alumni and Friends
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-[#111111]">
          {["Connect", "Volunteer Opportunities", "Reunite", "Learn & Travel", "Give"].map((item, idx) => (
            <a key={idx} href="#" className="relative overflow-hidden group py-1">
              <span className="group-hover:text-[#a51417] transition-colors duration-300">{item}</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#a51417] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </a>
          ))}
          <button className="text-black ml-2 hover:text-[#a51417] hover:scale-110 transition-all duration-300">
            <Search size={20} strokeWidth={2.5} />
          </button>
        </nav>
      </div>
    </motion.header>
  );
}