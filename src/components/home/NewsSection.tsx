import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsSection() {
  const news = [
    { img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80", category: "ALUMNI NEWS", title: "Harmonizing past, present, and future", date: "January 20, 2026" },
    { img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80", category: "WASHU MAGAZINE", title: "A community champion", date: "December 3, 2025" },
    { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80", category: "WASHU MAGAZINE", title: "Creating joy at Pixar", date: "August 8, 2025" }
  ];

  return (
    <section className="bg-white py-24 px-6 lg:px-8">
      <div className="max-w-[1250px] mx-auto">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end border-b border-gray-200 pb-5 mb-14"
        >
          <h3 className="text-[34px] font-serif text-gray-900">
            Latest Alumni News
          </h3>
          <a href="#" className="flex items-center gap-2 text-[#a51417] text-[12px] font-bold tracking-widest uppercase hover:text-black transition-colors group">
            News & Awards <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {news.map((n, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden mb-6 bg-gray-100">
                <img
                  src={n.img}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  alt={n.title}
                />
              </div>

              <p className="text-[11px] font-bold text-[#a51417] tracking-widest uppercase mb-3">
                {n.category}
              </p>

              <h4 className="font-serif text-[22px] text-gray-900 leading-snug mb-3 group-hover:text-[#a51417] transition-colors duration-300">
                {n.title}
              </h4>

              <p className="text-[13px] text-gray-500 font-light">
                {n.date}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}