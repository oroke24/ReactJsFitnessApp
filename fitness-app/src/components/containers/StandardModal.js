import React, { useState } from 'react';

const StandardModal = ({isOpen, onClose, children}) =>{
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center be-grey-800 bg-opacity-50 transition-opacity duration-300 ${isOpen? `opacity-100`:`opacity-0 pointer-events-none` }`}
            onClick={onClose}
        >
            <div
            className="bg-white rounded-lg w-11/12 p-6 shadow-xl transform transition-all duration-300 sm:w-1/3 overflow-y-auto-y"
            onClick={(e) => e.stopPropagation()}
            >
                {/*Content pass as children will be rendered here */}
                {children}
            </div>
        </div>
    );
};

export default StandardModal;