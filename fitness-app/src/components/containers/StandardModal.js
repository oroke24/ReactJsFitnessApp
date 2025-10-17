import React, { useState } from 'react';

const StandardModal = ({ isOpen, onClose, children }) => {
    return (
        <div
            className={`color-white fixed inset-0 z-50 flex items-center justify-center be-grey-800 bg-opacity-50 transition-opacity duration-300 ${isOpen ? `opacity-100` : `opacity-0 pointer-events-none`}`}
            onClick={onClose}
        >
            <div
                className="bg-gray-700 bg-opacity-95 rounded-lg w-11/12 max-h-[90vh] p-6 shadow-xl transform transition-all duration-300 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full flex justify-end">
                    <button className="flex justify-center px-4 text-xl"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[75vh]">
                    {/*Content pass as children will be rendered here */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StandardModal;