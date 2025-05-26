import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
                        currentPage,
                        totalPages,
                        onPageChange,
                        totalItems,
                        itemsPerPage,
                        showingText = true
                    }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 2) {
                endPage = 4;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 3;
            }

            if (startPage > 2) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-6 px-2">
            {showingText && totalItems > 0 && (
                <p className="text-sm text-gray-600 mb-4 md:mb-0">
                    Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </p>
            )}

            <div className="flex space-x-1">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-9 h-9 rounded-md ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                    }`}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </motion.button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="flex items-center justify-center w-9 h-9 text-gray-500">
                            ...
                        </span>
                    ) : (
                        <motion.button
                            key={`page-${page}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onPageChange(page)}
                            className={`flex items-center justify-center w-9 h-9 rounded-md ${
                                currentPage === page
                                    ? 'bg-blue-800 text-white font-medium'
                                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                            }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </motion.button>
                    )
                ))}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-9 h-9 rounded-md ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                    }`}
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </motion.button>
            </div>
        </div>
    );
};

export default Pagination;
