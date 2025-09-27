import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker to use local file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

// Suppress PDF.js warnings and reduce verbosity
try {
  (pdfjsLib.GlobalWorkerOptions as any).verbosity = pdfjsLib.VerbosityLevel?.ERRORS || 0;
} catch (error) {
  // VerbosityLevel might not be available in all versions
  console.log('PDF.js verbosity setting not available');
}

// Disable worker validation to prevent fallback to CDN
if (typeof window !== 'undefined') {
  console.log('PDF.js worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
}

export { pdfjsLib };
