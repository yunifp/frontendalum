import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1250px] mx-auto px-6 lg:px-8 pt-24 pb-16 grid md:grid-cols-4 gap-12 lg:gap-16">
        
        <div>
          <h3 className="font-bold text-[13px] tracking-widest uppercase mb-8">
            University Advancement
          </h3>
          <p className="text-[13px] text-gray-400 leading-relaxed font-light mb-5">
            MSC 1210-413-130<br />
            1 Brookings Drive<br />
            St. Louis, MO 63130
          </p>
          <p className="text-[13px] text-gray-400 font-light">
            866-988-7477 | <a href="#" className="underline hover:text-white transition-colors">alumni@wustl.edu</a>
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[13px] tracking-widest uppercase mb-8">
            Get Involved
          </h4>
          <ul className="space-y-4 text-[13px] text-gray-400 font-light">
            {["Regional Networks", "Shared Interest Groups", "Professional Networks", "Volunteer", "Travel with Us"].map((link, i) => (
              <li key={i}><a href="#" className="hover:text-white hover:underline transition-all">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[13px] tracking-widest uppercase mb-8">
            Resources
          </h4>
          <ul className="space-y-4 text-[13px] text-gray-400 font-light">
            {["WashU CNX", "Reunion at WashU", "For Parents & Families", "For Current Students"].map((link, i) => (
              <li key={i}><a href="#" className="hover:text-white hover:underline transition-all">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[13px] tracking-widest uppercase mb-8">
            Learn More
          </h4>
          <ul className="space-y-4 text-[13px] text-gray-400 font-light mb-10">
            {["University Advancement", "Giving to WashU", "Why Give", "Campaign", "Contact Us"].map((link, i) => (
              <li key={i}><a href="#" className="hover:text-white hover:underline transition-all">{link}</a></li>
            ))}
          </ul>

          <div className="flex gap-4 text-white">
            <a href="#" className="bg-[#333] text-white p-2 rounded-full hover:bg-[#a51417] transition-colors duration-300"><Facebook size={16} fill="currentColor" stroke="none" /></a>
            <a href="#" className="bg-[#333] text-white p-2 rounded-full hover:bg-[#a51417] transition-colors duration-300"><Twitter size={16} fill="currentColor" stroke="none" /></a>
            <a href="#" className="bg-[#333] text-white p-2 rounded-full hover:bg-[#a51417] transition-colors duration-300"><Linkedin size={16} fill="currentColor" stroke="none" /></a>
            <a href="#" className="bg-[#333] text-white p-2 rounded-full hover:bg-[#a51417] transition-colors duration-300"><Youtube size={16} /></a>
            <a href="#" className="bg-[#333] text-white p-2 rounded-full hover:bg-[#a51417] transition-colors duration-300"><Instagram size={16} /></a>
          </div>
        </div>

      </div>

      <div className="max-w-[1250px] mx-auto px-6 lg:px-8 py-8 border-t border-gray-800 text-[12px] text-gray-500 font-light">
        © 2026 Washington University in St. Louis
      </div>
    </footer>
  );
}