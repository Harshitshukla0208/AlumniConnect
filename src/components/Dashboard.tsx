import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, LinkedinIcon, GraduationCap, Briefcase, MapPin, Search, X } from 'lucide-react';

// Inline Card Components remain the same...
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-lg shadow ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`${className}`}>
        {children}
    </div>
);

const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

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

const API_URL = 'http://localhost:3001';

const AlumniDashboard = () => {
    const [alumni, setAlumni] = useState<AlumniData[]>([]);
    const [loading, setLoading] = useState(false);
    const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [failedImages, setFailedImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<AlumniData[]>([]);
    const loadingRef = useRef<HTMLDivElement>(null);
    const searchTimeout = useRef<NodeJS.Timeout>();
    const batchSize = 8;

    const handleSearch = useCallback(async (query: string) => {
        if (query.trim() === '') {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setIsSearching(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data.items);
        } catch (error) {
            console.error('Search failed:', error);
            setError('Failed to perform search. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search handler
    const debouncedSearch = useCallback((query: string) => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            handleSearch(query);
        }, 300);
    }, [handleSearch]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setSearchResults([]);
    };

    // Original fetchAlumni function remains the same...
    const fetchAlumni = useCallback(async () => {
        if (loading || !hasMore || isSearching) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_URL}/ran`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    indexes: usedIndexes,
                    limit: batchSize,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();
            
            setAlumni(prevAlumni => {
                const newAlumni = [...prevAlumni, ...data.items];
                return Array.from(new Map(newAlumni.map(item => [item.NAME, item])).values());
            });
            setUsedIndexes(prevIndexes => [...prevIndexes, ...data.indexes]);
            setHasMore(data.remaining > 0);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, usedIndexes, isSearching]);

    // Observer effect remains the same...
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isSearching) {
                    fetchAlumni();
                }
            },
            { threshold: 0.1 }
        );

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => observer.disconnect();
    }, [fetchAlumni, isSearching]);

    // Initial load
    useEffect(() => {
        if (!isSearching) {
            fetchAlumni();
        }
    }, [isSearching]);

    // AlumniCard component remains the same...
    const AlumniCard = ({ alumnus, index }: { alumnus: AlumniData; index: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.3,
                delay: Math.min((index % batchSize) * 0.1, 0.3)
            }}
            className="h-full"
            layout
        >
            <Card className="h-full transform-gpu transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 h-24 rounded-t-lg" />
                        <div className="relative pt-6 px-4">
                            <div className="mx-auto w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white transform-gpu">
                                <img
                                    loading="lazy"
                                    src={failedImages.includes(alumnus.PIC) ? 
                                        "/api/placeholder/96/96" : 
                                        alumnus.PIC
                                    }
                                    alt={alumnus.NAME}
                                    className="w-full h-full object-cover"
                                    onError={() => {
                                        if (!failedImages.includes(alumnus.PIC)) {
                                            setFailedImages(prev => [...prev, alumnus.PIC]);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2 truncate">
                            {alumnus.NAME}
                        </h3>
                        <div className="flex justify-center mb-4">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 truncate max-w-[90%]">
                                {alumnus.COMPANY}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                                <span className="text-gray-700">Batch {alumnus.BATCH}</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                                <span className="text-gray-700 truncate">{alumnus.FIELD}</span>
                            </div>
                            {alumnus.BRANCH && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span className="text-gray-700 truncate">{alumnus.BRANCH}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-3 mt-4 pt-4 border-t">
                            {[
                                { icon: Mail, href: `mailto:${alumnus.EMAIL}` },
                                { icon: LinkedinIcon, href: alumnus.PROFILE }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    target={item.icon === LinkedinIcon ? "_blank" : undefined}
                                    rel={item.icon === LinkedinIcon ? "noopener noreferrer" : undefined}
                                    className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors transform-gpu hover:scale-105 active:scale-95"
                                >
                                    <item.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    // LoadingSkeleton component remains the same...
    const LoadingSkeleton = () => (
        <Card>
            <CardContent className="p-0">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 h-24 rounded-t-lg" />
                    <div className="relative pt-6 px-4">
                        <Skeleton className="mx-auto w-24 h-24 rounded-full" />
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Alumni Directory</h1>
                    <p className="text-gray-600">Discover and connect with our distinguished alumni network</p>
                    
                    <div className="mt-6 max-w-2xl mx-auto relative">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                placeholder="Search by name, company, batch, field, or branch..."
                                className="w-full py-3 pl-12 pr-10 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                >
                                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isSearching
                        ? searchResults.map((alumnus, index) => (
                            <AlumniCard 
                                key={`${alumnus.NAME}-${index}`} 
                                alumnus={alumnus} 
                                index={index}
                            />
                        ))
                        : alumni.map((alumnus, index) => (
                            <AlumniCard 
                                key={`${alumnus.NAME}-${index}`} 
                                alumnus={alumnus} 
                                index={index}
                            />
                        ))
                    }
                </div>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                        {[...Array(4)].map((_, i) => (
                            <LoadingSkeleton key={i} />
                        ))}
                    </div>
                )}

                {!isSearching && <div ref={loadingRef} className="h-4 mt-8" />}

                {!hasMore && !isSearching && alumni.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">You've reached the end of the list</p>
                    </div>
                )}

                {isSearching && searchResults.length === 0 && !loading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No results found for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlumniDashboard;