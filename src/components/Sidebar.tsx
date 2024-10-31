import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Building, BookOpen, GraduationCap, Layers, Code } from 'lucide-react';
import { cn } from '../lib/utils';

interface FilterCategory {
    name: string;
    icon: React.ReactNode;
    subCategories?: string[];
    description?: string;
}

interface SidebarProps {
    className?: string;
    isMobile?: boolean;
    onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, isMobile, onMobileClose }) => {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const handleCategoryClick = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleSubCategoryClick = (_subCategory: string) => {
        if (isMobile) {
            // Add your navigation logic here
            onMobileClose?.();
        }
    };

    const handleProfileClick = () => {
        if (isMobile) {
            // Add your navigation logic here
            onMobileClose?.();
        }
    };

    const filters: FilterCategory[] = [
        {
            name: 'Core Engineering',
            icon: <Layers size={18} className="text-blue-600" />,
            subCategories: ['Mechanical', 'Electrical', 'Civil', 'Chemical'],
            description: 'Traditional engineering disciplines'
        },
        {
            name: 'IT & Software',
            icon: <Code size={18} className="text-indigo-600" />,
            subCategories: ['Software Development', 'Data Science', 'Cloud Computing', 'Cybersecurity'],
            description: 'Technology and software roles'
        },
        {
            name: 'Top Companies',
            icon: <Building size={18} className="text-green-600" />,
            subCategories: ['FAANG', 'Fortune 500', 'Startups', 'Consulting'],
            description: 'Leading industry employers'
        },
        {
            name: 'Research & Academia',
            icon: <BookOpen size={18} className="text-purple-600" />,
            subCategories: ['PhD Programs', 'Research Labs', 'Universities', 'Publications'],
            description: 'Academic and research positions'
        },
        {
            name: 'Batch Explorer',
            icon: <GraduationCap size={18} className="text-orange-600" />,
            subCategories: ['2020-2024', '2015-2019', '2010-2014', '2005-2009'],
            description: 'Find alumni by graduation year'
        }
    ];

    return (
        <div className="flex">
            <div
                className={cn(
                    'fixed top-0 left-0 h-screen bg-white border-r border-gray-200',
                    'flex flex-col',
                    'shadow-sm',
                    'z-50',
                    'w-80', // Fixed width for desktop
                    className
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center px-4 border-b border-gray-100">
                    <div className="text-lg font-semibold text-gray-800">
                        Dashboard
                    </div>
                    {isMobile && (
                        <button
                            onClick={onMobileClose}
                            className="ml-auto text-gray-500 hover:text-gray-700"
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
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex-1 overflow-y-auto">
                    {filters.map((filter) => (
                        <div key={filter.name}>
                            <motion.div
                                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.8)' }}
                                className="px-4 py-3 cursor-pointer"
                                onClick={() => handleCategoryClick(filter.name)}
                            >
                                <div className="flex items-center">
                                    {filter.icon}
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 font-medium">{filter.name}</span>
                                            {filter.subCategories && (
                                                <motion.span
                                                    animate={{ rotate: expandedCategories[filter.name] ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown size={16} className="text-gray-400" />
                                                </motion.span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{filter.description}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <AnimatePresence initial={false}>
                                {expandedCategories[filter.name] && filter.subCategories && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ 
                                            height: 'auto', 
                                            opacity: 1,
                                            transition: {
                                                height: { duration: 0.2 },
                                                opacity: { duration: 0.3 }
                                            }
                                        }}
                                        exit={{ 
                                            height: 0, 
                                            opacity: 0,
                                            transition: {
                                                height: { duration: 0.2 },
                                                opacity: { duration: 0.1 }
                                            }
                                        }}
                                        className="overflow-hidden bg-gray-50"
                                    >
                                        {filter.subCategories.map((sub) => (
                                            <div
                                                key={sub}
                                                className="pl-12 py-2 cursor-pointer text-gray-600 text-sm hover:bg-gray-100"
                                                onClick={() => handleSubCategoryClick(sub)}
                                            >
                                                {sub}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Profile Section */}
                <div className="border-t border-gray-200">
                    <motion.div
                        whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.8)' }}
                        className="px-4 py-3 cursor-pointer flex items-center"
                        onClick={handleProfileClick}
                    >
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Your Profile</p>
                            <p className="text-xs text-gray-500">View and edit settings</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;