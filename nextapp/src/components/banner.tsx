import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
export default function Banner() {
  return (
    <motion.div
      className="bg-red-500 text-white py-4 px-6"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring\t", stiffness: 1000, damping: 50 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6" />
          <p className="font-medium">
            Our backend is currently down. We are working on fixing it as soon
            as possible.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
