import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, LinkedinIcon, GraduationCap, Briefcase, MapPin } from 'lucide-react';

interface AlumniData {
    NAME: string;
    COMPANY: string;
    BATCH: number;
    PIC: string;
    PROFILE: string;
    EMAIL: string;
    FIELD: string;
    BRANCH: string | null;
}

interface ApiResponse {
    items: AlumniData[];
    indexes: number[];
    remaining: number;
}

const AlumniDashboard = () => {
    const [alumni, setAlumni] = useState<AlumniData[]>([]);
    const [loading, setLoading] = useState(true);
    const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [failedImages, setFailedImages] = useState<string[]>([]); // State to track failed images

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/ran', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ indexes: usedIndexes }),
            });

            const data: ApiResponse = await response.json();

            setUsedIndexes(prevIndexes => [...prevIndexes, ...data.indexes]);
            setAlumni(prevAlumni => [...data.items, ...prevAlumni]);
            setHasMore(data.remaining > 0);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, []);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            >= document.documentElement.offsetHeight - 1000
            && !loading
            && hasMore
        ) {
            fetchAlumni();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, usedIndexes]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Alumni Directory</h1>
                    <p className="text-gray-600">Discover and connect with our distinguished alumni network</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {alumni.map((alumnus, index) => (
                        <motion.div
                            key={`${alumnus.NAME}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Background Gradient Banner */}
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-400 to-indigo-500" />

                                {/* Profile Image */}
                                <div className="relative pt-8 px-6 flex justify-center">
                                    <motion.div
                                        className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <img
                                            src={failedImages.includes(alumnus.PIC) ? "/path/to/fallback-image.png" : alumnus.PIC}
                                            alt={alumnus.NAME}
                                            className="w-full h-full object-cover"
                                            onError={() => {
                                                if (!failedImages.includes(alumnus.PIC)) {
                                                    setFailedImages(prevFailed => [...prevFailed, alumnus.PIC]);
                                                }
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                                        {alumnus.NAME}
                                    </h3>
                                    <div className="text-center mb-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                            {alumnus.COMPANY}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                                            <GraduationCap className="w-4 h-4 text-blue-500" />
                                            <span>Batch {alumnus.BATCH}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                                            <Briefcase className="w-4 h-4 text-blue-500" />
                                            <span>{alumnus.FIELD}</span>
                                        </div>
                                        {alumnus.BRANCH && (
                                            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                <span>{alumnus.BRANCH}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
                                        <motion.a
                                            href={`mailto:${alumnus.EMAIL}`}
                                            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Mail className="w-5 h-5" />
                                        </motion.a>
                                        <motion.a
                                            href={alumnus.PROFILE}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <LinkedinIcon className="w-5 h-5" />
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center mt-8">
                        <motion.div
                            className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                )}

                {!hasMore && alumni.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-600 mt-8"
                    >
                        You've reached the end of the list
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default AlumniDashboard;
