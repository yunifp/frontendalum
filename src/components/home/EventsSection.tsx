import { Castle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function EventsSection() {
  const events = [
    { date: "4", month: "MAR", title: "CHICAGO: Finance Networking Luncheon, hosted by the Chicago Professionals Network", time: "Wednesday, March 4, 12:00 PM - 1:30 PM CST" },
    { date: "25", month: "MAR", title: "Graduates and AI: Who wins the future of work with Nicholas Thompson of The Atlantic", time: "Wednesday, March 25, 5:00 PM - 7:00 PM CDT" },
    { date: "31", month: "MAR", title: "Public Health in Challenging Times: Finding a Way Forward", time: "Tuesday, March 31, 12:00 PM - 2:00 PM CDT" }
  ];

  return (
    <section className="bg-white py-24 px-6 lg:px-8">
      <div className="max-w-[1250px] mx-auto grid md:grid-cols-2 gap-16 lg:gap-24">

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-[13px] font-bold text-gray-900 tracking-widest uppercase mb-12">
            Upcoming Events
          </h3>

          <div className="space-y-12">
            {events.map((e, i) => (
              <div key={i} className="flex gap-8 group cursor-pointer">
                <div className="flex flex-col items-center justify-start w-16 pt-1 text-[#a51417] shrink-0 border-t-2 border-transparent group-hover:border-[#a51417] transition-all duration-300">
                  <span className="text-4xl font-serif leading-none mt-2">{e.date}</span>
                  <span className="text-[13px] font-bold mt-2 tracking-wide">{e.month}</span>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-[19px] leading-snug group-hover:text-[#a51417] transition-colors duration-300 mb-2">
                    {e.title}
                  </h4>
                  <p className="text-[13px] text-gray-500 font-medium">
                    {e.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="inline-flex items-center gap-2 mt-12 text-[#a51417] text-[12px] font-bold uppercase tracking-widest hover:text-black transition-colors group">
            View all events <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-10 pt-4"
        >
          <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 flex items-center justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer group">
            <div className="flex items-center gap-6">
              <Castle size={40} className="text-gray-800 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <span className="font-bold text-[15px] text-gray-900 leading-tight">Celebrate and reconnect at<br/>Reunion</span>
            </div>
            <span className="text-[#a51417] text-[11px] font-bold uppercase tracking-widest group-hover:underline text-right">
              Find your reunion
            </span>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#285c4d] text-white relative flex flex-col md:flex-row h-auto md:h-72 mt-16 cursor-pointer group shadow-lg"
          >
            <div className="w-full md:w-[45%] md:absolute md:-left-8 md:-top-8 md:-bottom-8 z-10 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&q=80"
                className="w-full h-56 md:h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                alt="Bhutan"
              />
            </div>

            <div className="w-full md:w-[55%] ml-auto p-8 md:p-12 flex flex-col justify-center">
              <p className="text-[11px] font-bold tracking-widest uppercase mb-4 text-[#dcb439]">
                Featured Event
              </p>
              <h4 className="text-[28px] font-serif leading-snug mb-4 group-hover:underline decoration-2 underline-offset-4">
                Alumni Travel<br/>Program: Kingdom<br/>of Bhutan
              </h4>
              <p className="text-[13px] font-light opacity-90">
                October 23–November 3, 2026
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}