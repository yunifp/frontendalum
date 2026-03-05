import { Users, ArrowRightLeft, Building, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function IntroSection() {
  const items = [
    { icon: Users, text: "Find alumni\nnetworks" },
    { icon: ArrowRightLeft, text: "Make career\nconnections\non WashU CNX" },
    { icon: Building, text: "View\nupcoming\ntravel\ndestinations" },
    { icon: Calendar, text: "Explore\nevents" },
    { icon: MessageSquare, text: "Learn about\nReunion" }
  ];

  return (
    <section className="bg-white pt-10 pb-24 px-6 lg:px-8 relative overflow-hidden">
      <div className="hidden lg:block absolute right-[22%] -top-[150px] w-[1px] h-[calc(100%+200px)] bg-[#a51417] z-0"></div>

      <div className="max-w-[1250px] mx-auto relative z-10 lg:pl-32">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#333333] text-[22px] font-light leading-[1.6] mb-16 max-w-[800px]"
        >
          WashU’s worldwide community of alumni and friends represent many
          backgrounds, interests, and professions. Whether you are
          reconnecting or staying engaged with WashU, we have you covered
          with opportunities to network, attend events, volunteer, keep up-to-date 
          with university news, and more.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-0 lg:divide-x divide-gray-200 text-[#a51417] max-w-[1000px]"
        >
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={`flex flex-col items-start gap-5 cursor-pointer group ${idx !== 0 ? 'lg:pl-8' : 'lg:pr-8'}`}
            >
              <item.icon size={36} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-300" />
              <p className="text-[14px] font-bold leading-[1.3] group-hover:underline whitespace-pre-line">
                {item.text}
              </p>
              <ArrowRight size={18} strokeWidth={2} className="mt-auto transform group-hover:translate-x-2 transition-transform duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}