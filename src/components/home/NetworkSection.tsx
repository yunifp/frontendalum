import { motion } from "framer-motion";

export default function NetworkSection() {
  return (
    <section className="bg-[#f9f9f9] py-24 px-6 lg:px-8 relative">
      <div className="max-w-[1250px] mx-auto flex flex-col lg:flex-row items-center relative z-10 gap-16 lg:gap-24">

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-[55%]"
        >
          <div className="overflow-hidden shadow-xl">
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7 }}
              src="https://images.unsplash.com/photo-1511632765486-a01c80cf8cb4?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-[400px] lg:h-[500px] object-cover"
              alt="WashU Alumni Networking"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-[45%]"
        >
          <div className="w-[1px] h-16 bg-[#a51417] mb-8"></div>
          
          <p className="text-[#a51417] text-[11px] font-bold tracking-widest uppercase mb-4">
            Networks
          </p>

          <h2 className="text-[44px] font-serif text-[#111111] leading-[1.1] mb-6 tracking-tight">
            You already have one thing in common.
          </h2>

          <p className="text-[#444444] text-[17px] font-light leading-[1.6] mb-10 pr-4">
            Explore our networks to meet other WashU alumni, parents, and friends
            in your region, connect over shared interests or backgrounds, and find
            professionals in your industry.
          </p>

          <button className="border border-[#a51417] text-[#a51417] bg-transparent rounded-[2px] px-8 py-3 text-[14px] font-bold tracking-wider uppercase hover:bg-[#a51417] hover:text-white transition-colors duration-300">
            Connect
          </button>
        </motion.div>

      </div>
    </section>
  );
}