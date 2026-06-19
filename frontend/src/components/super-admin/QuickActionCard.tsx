import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  buttonLabel: string;
  route: string;
  color: string;
  index?: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  title,
  description,
  buttonLabel,
  route,
  color,
  index = 0,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.04,
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{
        y: -4,
      }}
      style={{
        backgroundColor: color,
      }}
      className="h-full rounded-[28px] border border-black/5 p-6 shadow-lg transition-all duration-300"
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f172a]">
            <Icon className="h-6 w-6 text-white" />
          </div>

          <h3 className="mt-6 text-xl font-black text-slate-900">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            {description}
          </p>
        </div>

        <Link
          to={route}
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          {buttonLabel}
        </Link>
      </div>
    </motion.div>
  );
};

export default QuickActionCard;