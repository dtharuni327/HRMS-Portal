import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  buttonLabel: string;
  route: string;
  index?: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  title,
  description,
  buttonLabel,
  route,
  index = 0,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -4 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a3a52] to-[#0f2440] p-6 shadow-lg transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
    >
      {/* Animated gradient border overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-cyan-500/20 blur-2xl transition-all duration-300 group-hover:h-32 group-hover:w-32 group-hover:bg-cyan-500/30" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Icon Container */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 transition-all duration-300 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
            <Icon className="h-6 w-6 text-cyan-400 transition-all duration-300 group-hover:text-cyan-300" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-5 flex-grow">
          <h3 className="text-lg font-bold text-white transition-colors duration-300">
            {title}
          </h3>

          <p className="mt-2 text-sm text-slate-300 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Button */}
        <Link
          to={route}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 active:scale-95"
        >
          {buttonLabel}
        </Link>
      </div>
    </motion.div>
  );
};

export default QuickActionCard;
