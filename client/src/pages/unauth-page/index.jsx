import { motion } from "framer-motion";

function UnauthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <motion.span 
        className="text-6xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        🔒
      </motion.span>
      <motion.h1 
        className="text-2xl font-semibold mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        You don&apos;t have access to view this page
      </motion.h1>
    </div>
  );
}

export default UnauthPage;
