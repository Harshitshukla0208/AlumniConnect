import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AlumniDashboard from './components/Dashboard';

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const mainContentVariants = {
    desktop: {
      marginLeft: '320px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    mobile: {
      marginLeft: '0px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <NavBar />

      {/* Desktop Sidebar - Always visible */}
      <div className="hidden md:block">
        <Sidebar className="h-full" />
      </div>

      {/* <antArtifact identifier="mobile-layout" type="application/vnd.ant.code" language="typescript" title="Updated Layout Component"> */}
        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            {isMobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{
                    type: 'tween', // Changed from spring to tween
                    duration: 0.25,
                    ease: 'easeInOut'
                  }}
                  className="fixed top-0 left-0 h-full w-64 z-50"
                >
                  <Sidebar
                    isMobile={true}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                    className="h-full"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="fixed bottom-4 left-4 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.div>
          </button>
        </div>

        {/* Main Content */}
        <motion.main
          variants={mainContentVariants}
          animate={window.innerWidth < 768 ? 'mobile' : 'desktop'}
          className="pt-16 min-h-screen"
        >
          <div className="p-6">
            {/* <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="mt-4 text-gray-600">
                Welcome to your dashboard. This content will adjust based on the sidebar state.
              </p>
            </div> */}
            <AlumniDashboard />
          </div>
        </motion.main>
    </div>
  );
};

export default Layout;