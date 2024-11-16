import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, GraduationCap } from 'lucide-react';
import logo from "../assets/logo.png";

type MenuItem = {
  [key: string]: {
    [category: string]: string[];
  };
};

type ActiveDropdownType = keyof MenuItem | null;

const menuItems: MenuItem = {
    'New & Featured': {
        Featured: ['New Arrivals', 'Bestsellers', 'SNKRS Launch Calendar', 'Member Exclusive', 'Customise with Nike By You', "What's Trending"],
        'Shop Icons': ['Air Force 1', 'Air Jordan 1', 'Air Max', 'Dunk', 'Cortez', 'Blazer', 'Pegasus', 'Vomero'],
        'Shop By Sport': ['Running', 'Basketball', 'Football', 'Golf', 'Tennis', 'Gym and Training', 'Yoga', 'Skateboarding']
    },
    'Men': {
        Featured: ['New Arrivals', 'Bestsellers', 'SNKRS Launch Calendar', 'Member Exclusive', 'Customise with Nike By You', "What's Trending"],
        'Shop Icons': ['Air Force 1', 'Air Jordan 1', 'Air Max', 'Dunk', 'Cortez', 'Blazer', 'Pegasus', 'Vomero'],
        'Shop By Sport': ['Running', 'Basketball', 'Football', 'Golf', 'Tennis', 'Gym and Training', 'Yoga', 'Skateboarding']
    },
    'Women': {
        Featured: ['New Arrivals', 'Bestsellers', 'SNKRS Launch Calendar', 'Member Exclusive', 'Customise with Nike By You', "What's Trending"],
        'Shop Icons': ['Air Force 1', 'Air Jordan 1', 'Air Max', 'Dunk', 'Cortez', 'Blazer', 'Pegasus', 'Vomero'],
        'Shop By Sport': ['Running', 'Basketball', 'Football', 'Golf', 'Tennis', 'Gym and Training', 'Yoga', 'Skateboarding']
    },
    'Kids': {
        Featured: ['New Arrivals', 'Bestsellers', 'SNKRS Launch Calendar', 'Member Exclusive', 'Customise with Nike By You', "What's Trending"],
        'Shop Icons': ['Air Force 1', 'Air Jordan 1', 'Air Max', 'Dunk', 'Cortez', 'Blazer', 'Pegasus', 'Vomero'],
        'Shop By Sport': ['Running', 'Basketball', 'Football', 'Golf', 'Tennis', 'Gym and Training', 'Yoga', 'Skateboarding']
    },
    'Sale': {
        Featured: ['New Arrivals', 'Bestsellers', 'SNKRS Launch Calendar', 'Member Exclusive', 'Customise with Nike By You', "What's Trending"],
        'Shop Icons': ['Air Force 1', 'Air Jordan 1', 'Air Max', 'Dunk', 'Cortez', 'Blazer', 'Pegasus', 'Vomero'],
        'Shop By Sport': ['Running', 'Basketball', 'Football', 'Golf', 'Tennis', 'Gym and Training', 'Yoga', 'Skateboarding']
    },
    'SNKRS': {
        Featured: ['New Arrivals', 'Bestsellers', 'SNKRS Launch Calendar', 'Member Exclusive', 'Customise with Nike By You', "What's Trending"],
        'Shop Icons': ['Air Force 1', 'Air Jordan 1', 'Air Max', 'Dunk', 'Cortez', 'Blazer', 'Pegasus', 'Vomero'],
        'Shop By Sport': ['Running', 'Basketball', 'Football', 'Golf', 'Tennis', 'Gym and Training', 'Yoga', 'Skateboarding']
    }
};

const NavBar = () => {
    const [activeDropdown, setActiveDropdown] = useState<ActiveDropdownType>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const popularSearches = [
        'air force 1',
        'jordan',
        'air max',
        'shoes'
    ];

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.15,
                staggerChildren: 0.03
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.1 }
        }
    };

    const searchOverlayVariants = {
        hidden: { opacity: 0, y: "-100%" },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                mass: 0.5
            }
        },
        exit: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.15 }
        }
    };

    const mobileMenuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.15 }
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.1 }
        }
    };

    return (
        <div className="relative">
            <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-white z-40">
                <div className="flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.1 }}
                        className="cursor-pointer h-12 flex items-center"
                    >
                        <GraduationCap size={24} className="text-blue-600" />
                    </motion.div>
                </div>

                <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
                    {(Object.entries(menuItems) as [keyof MenuItem, MenuItem[keyof MenuItem]][]).map(([item, submenu]) => (
                        <div
                            key={item}
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown(item)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <motion.button
                                className="px-2 py-1 text-sm font-medium"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.1 }}
                            >
                                {item}
                            </motion.button>

                            <AnimatePresence>
                                {activeDropdown === item && (
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="fixed left-0 w-full bg-white shadow-lg"
                                        style={{
                                            top: '100%',
                                            zIndex: 45
                                        }}
                                    >
                                        <div className="grid grid-cols-3 gap-8 p-8 mx-auto max-w-7xl">
                                            {Object.entries(submenu).map(([category, items]) => (
                                                <motion.div
                                                    key={category}
                                                    variants={dropdownVariants}
                                                >
                                                    <h3 className="mb-4 text-sm font-bold">{category}</h3>
                                                    <ul className="space-y-2">
                                                        {items.map((subItem) => (
                                                            <motion.li
                                                                key={subItem}
                                                                variants={dropdownVariants}
                                                                whileHover={{ x: 5 }}
                                                                transition={{ duration: 0.1 }}
                                                            >
                                                                <a href="#" className="text-sm text-gray-600 hover:text-black">
                                                                    {subItem}
                                                                </a>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.1 }}
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2"
                        >
                            <Search className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.1 }}
                            className="p-2"
                        >
                            <Heart className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.1 }}
                            className="p-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                        </motion.button>
                    </div>

                    <button onClick={() => setIsSearchOpen(true)} className="md:hidden p-2">
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden bg-white shadow-lg z-40"
                    >
                        <div className="p-4">
                            {Object.keys(menuItems).map((item) => (
                                <motion.button
                                    key={item}
                                    className="block w-full text-left px-4 py-2 text-sm font-medium"
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    {item}
                                </motion.button>
                            ))}

                            <div className="flex items-center space-x-4 px-4 py-2 mt-4">
                                <button onClick={() => setIsSearchOpen(true)} className="p-2">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="p-2">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-2">
                                    <ShoppingBag className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        variants={searchOverlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-white z-[60]"
                    >
                        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-12 h-12">
                                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                                </div>

                                <div className="flex-1 mx-4 md:mx-8">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="w-full py-3 pl-12 pr-4 bg-gray-100 rounded-full focus:outline-none"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.1 }}
                                    onClick={() => setIsSearchOpen(false)}
                                    className="text-sm font-medium"
                                >
                                    Cancel
                                </motion.button>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-4">Popular Search Terms</h3>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((term) => (
                                        <motion.button
                                            key={term}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.1 }}
                                            className="px-4 py-2 text-sm bg-gray-100 rounded-full"
                                        >
                                            {term}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NavBar;