import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

/**
 * LogoChecklistItem Component
 * Individual checkable item in the logo troubleshooting list
 */
interface LogoChecklistItemProps {
  title: string;
  description: string;
  instructions: string;
}

const LogoChecklistItem: React.FC<LogoChecklistItemProps> = ({ 
  title, 
  description, 
  instructions 
}) => {
  const [status, setStatus] = useState<'pending' | 'success' | 'failure'>('pending');
  const [expanded, setExpanded] = useState(false);

  const statusIcons = {
    pending: <HelpCircle className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors duration-300" />,
    success: <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0 transition-colors duration-300" />,
    failure: <XCircle className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 transition-colors duration-300" />
  };

  const statusBackgrounds = {
    pending: 'bg-white dark:bg-gray-700',
    success: 'bg-green-50 dark:bg-green-900/20',
    failure: 'bg-red-50 dark:bg-red-900/20'
  };

  return (
    <div className={`p-4 rounded-lg mb-3 border transition-colors duration-300 ${
      statusBackgrounds[status]
    } ${
      status === 'pending' ? 'border-gray-200 dark:border-gray-600' :
      status === 'success' ? 'border-green-200 dark:border-green-800' :
      'border-red-200 dark:border-red-800'
    }`}>
      <div className="flex items-start gap-3">
        {statusIcons[status]}
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-white transition-colors duration-300">
              {title}
            </h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('success')}
                className="px-2 py-1 text-xs rounded bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300 transition-colors duration-300"
              >
                Fixed
              </button>
              <button
                onClick={() => setStatus('failure')}
                className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 transition-colors duration-300"
              >
                Issue
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
            {description}
          </p>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300"
          >
            {expanded ? 'Hide instructions' : 'Show instructions'}
          </button>
          
          {expanded && (
            <div className="mt-3 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-300">
              {instructions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * LogoCheckList Component
 * A step-by-step checklist for troubleshooting logo issues
 */
export const LogoCheckList: React.FC = () => {
  const steps = [
    {
      title: "1. Verify File Path",
      description: "Make sure the logo file is in the correct location and referenced correctly.",
      instructions: `For Vite + React: Place your logo in the public folder (e.g., public/images/logo.png)
Then reference it in your code as: <img src="/images/logo.png" alt="Logo" />
Note: Do NOT include "public" in the path when referencing.`
    },
    {
      title: "2. Check File Format",
      description: "Ensure the image format is widely supported by browsers.",
      instructions: `Recommended formats:
- PNG: Best for logos with transparency
- SVG: Best for vector graphics that scale well
- JPG: Good for photographs, but not ideal for logos
- WebP: Modern format with good compression, but check browser support
    
Check your file extension and make sure it matches the actual file format.`
    },
    {
      title: "3. Verify Image Dimensions",
      description: "Check if the image is too large, too small, or zero in dimensions.",
      instructions: `Recommended dimensions for logos:
- Width: 150-400px for standard logos
- Height: Proportional to width
- File size: <100KB (ideally <50KB)

You can check dimensions by:
1. Opening the image in any image editor
2. Using browser dev tools: right-click the image slot > Inspect > Look for dimensions
3. Using terminal: identify /path/to/logo.png (if you have ImageMagick installed)`
    },
    {
      title: "4. Review HTML/CSS",
      description: "Inspect the HTML markup and CSS styling affecting the logo.",
      instructions: `Common CSS issues that hide logos:
- display: none
- visibility: hidden
- opacity: 0
- width/height: 0
- overflow: hidden
- z-index too low (hidden behind other elements)

Check your component's JSX:
<img src="/images/logo.png" alt="Math Sprint Logo" className="w-24 h-24 object-contain" />

Ensure the parent container is properly sized and visible.`
    },
    {
      title: "5. Test Cross-Browser",
      description: "Verify the logo displays correctly across different browsers and devices.",
      instructions: `Test in at least these browsers:
- Chrome
- Firefox
- Safari
- Edge

And check on mobile devices or using responsive mode in browser dev tools.
Look for console errors related to image loading.`
    },
    {
      title: "6. Check for Corruption",
      description: "Determine if the image file itself is corrupted.",
      instructions: `Ways to check for corruption:
1. Open the image directly in a browser by visiting: http://localhost:5173/images/logo.png
2. Try opening the file in an image editor
3. Replace with a fresh copy of the logo file
4. Try a completely different image to see if the issue persists`
    },
    {
      title: "7. Verify Permissions",
      description: "Ensure proper file permissions and server configurations.",
      instructions: `For local development:
- Check file permissions (should be readable)
- Make sure your development server is running
- Verify Vite configuration in vite.config.ts

For deployed sites:
- Check that static assets were properly uploaded
- Verify that your hosting service serves static files correctly
- Check if the deployment platform has any special requirements for assets`
    }
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg my-8 max-w-3xl mx-auto transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white transition-colors duration-300">
        Logo Troubleshooting Checklist
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
        Work through this checklist to identify and resolve logo display issues.
        Mark each item as "Fixed" or "Issue" as you go.
      </p>
      
      <div className="space-y-2">
        {steps.map((step) => (
          <LogoChecklistItem
            key={step.title}
            title={step.title}
            description={step.description}
            instructions={step.instructions}
          />
        ))}
      </div>
      
      <div className="mt-6 text-sm bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 transition-colors duration-300">
        <p className="font-semibold mb-1">Still having issues?</p>
        <p>Try the LogoDebug component to interactively test different image paths and see detailed information about your logo loading status.</p>
      </div>
    </div>
  );
};