import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, PenTool as Tool, CheckSquare } from 'lucide-react';
import { LogoDebug } from '../components/LogoDebug';
import { LogoCheckList } from '../components/LogoChecklist';

export const LogoTroubleshooting: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-6 flex items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to App</span>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          Logo Troubleshooting Center
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
          Use this guide to diagnose and fix issues with the logo display in your Math Sprint application.
          Work through each of the tools below to identify and resolve the problem.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center text-center transition-colors duration-300">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1 transition-colors duration-300">Documentation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
              Comprehensive guide with step-by-step instructions
            </p>
            <a 
              href="#guide" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300"
            >
              View Documentation
            </a>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center text-center transition-colors duration-300">
            <Tool className="w-10 h-10 text-green-600 dark:text-green-400 mb-2 transition-colors duration-300" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1 transition-colors duration-300">Debug Tool</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
              Interactive tool to test different image paths
            </p>
            <a 
              href="#debug-tool" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300"
            >
              Use Debug Tool
            </a>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center text-center transition-colors duration-300">
            <CheckSquare className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-300" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1 transition-colors duration-300">Checklist</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
              Step-by-step checklist to track your progress
            </p>
            <a 
              href="#checklist" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300"
            >
              View Checklist
            </a>
          </div>
        </div>
      </div>
      
      {/* Documentation Section */}
      <section id="guide" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-300">
          Documentation
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 prose dark:prose-invert max-w-none transition-colors duration-300">
          <h3>Common Causes of Logo Display Issues</h3>
          <p>
            Logo display issues can occur for various reasons. Here are the most common causes:
          </p>
          
          <ol>
            <li>
              <strong>Incorrect file path</strong> - The most common cause is an incorrect reference to the logo file.
              In Vite, static assets should be placed in the <code>public</code> folder and referenced without the "public" prefix.
            </li>
            <li>
              <strong>Unsupported format</strong> - Make sure your image format is widely supported. PNG, JPG, and SVG work best.
            </li>
            <li>
              <strong>Image dimensions</strong> - Images that are too large can slow loading, while dimensions of 0 won't display.
            </li>
            <li>
              <strong>CSS issues</strong> - Check for CSS properties that might hide the logo.
            </li>
            <li>
              <strong>Browser compatibility</strong> - Some newer image formats may not work in all browsers.
            </li>
            <li>
              <strong>Corrupted file</strong> - The image file itself might be corrupted.
            </li>
            <li>
              <strong>Server configuration</strong> - The server might not be configured to serve static files correctly.
            </li>
          </ol>
          
          <h3>Math Sprint Specific Configuration</h3>
          <p>
            In the Math Sprint application, the logo is referenced in multiple components:
          </p>
          
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto transition-colors duration-300">
            <code>
{`// In Navbar.tsx
<img 
  src="/images/logo.png" 
  alt="Math Sprint Logo" 
  className="w-16 h-16 md:w-24 md:h-24 object-contain" 
/>

// In Auth.tsx
<img 
  src="/images/logo.png" 
  alt="Math Sprint Logo" 
  className="w-24 h-24 object-contain" 
/>

// In ScoreDisplay.tsx
<img 
  src="/images/logo.png" 
  alt="Math Sprint Logo" 
  className="w-8 h-8 object-contain"
/>`}
            </code>
          </pre>
          
          <p>
            Make sure the logo file exists at <code>public/images/logo.png</code> for these references to work correctly.
          </p>
          
          <h3>Quick Solution Tips</h3>
          <ul>
            <li>
              <strong>Replace the logo file</strong> - Try replacing the current logo with a new copy to rule out corruption.
            </li>
            <li>
              <strong>Use a placeholder temporarily</strong> - To test if the issue is with the file or the code, try a placeholder image from a service like placeholder.com.
            </li>
            <li>
              <strong>Check browser console</strong> - Look for 404 errors or other issues related to image loading.
            </li>
            <li>
              <strong>Verify file path</strong> - Double-check that the file path in your code matches the actual location of the file.
            </li>
          </ul>
        </div>
      </section>
      
      {/* Debug Tool Section */}
      <section id="debug-tool" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-300">
          Logo Debug Tool
        </h2>
        <LogoDebug />
      </section>
      
      {/* Checklist Section */}
      <section id="checklist" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-300">
          Troubleshooting Checklist
        </h2>
        <LogoCheckList />
      </section>
      
      <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg text-blue-800 dark:text-blue-200 mb-8 transition-colors duration-300">
        <h2 className="text-xl font-bold mb-2">Need Additional Help?</h2>
        <p className="mb-4">
          If you're still experiencing issues after going through this troubleshooting guide, consider these additional resources:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Review the <a href="https://vitejs.dev/guide/assets.html" target="_blank" rel="noopener noreferrer" className="underline">Vite documentation on static assets</a></li>
          <li>Check <a href="https://tailwindcss.com/docs/image-size" target="_blank" rel="noopener noreferrer" className="underline">Tailwind CSS documentation on image sizing</a></li>
          <li>Ensure your deployment platform is correctly configured for static assets</li>
          <li>Try implementing a text-based logo as a temporary fallback</li>
        </ul>
      </div>
    </div>
  );
};