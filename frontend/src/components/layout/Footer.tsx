import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Configurator. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};