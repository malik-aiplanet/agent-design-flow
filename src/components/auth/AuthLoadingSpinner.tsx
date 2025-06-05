import React from 'react';
import { Loader2 } from 'lucide-react';

export const AuthLoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <span className="text-white font-bold text-2xl">AI</span>
        </div>
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Planet</h2>
        <p className="text-gray-600">Initializing your workspace...</p>
      </div>
    </div>
  );
};