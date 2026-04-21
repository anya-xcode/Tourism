/**
 * Cloudinary Utility Functions
 * Handles URL optimization and transformation.
 */

/**
 * Appends Cloudinary optimization parameters to a URL.
 * Also handles extension conversion for non-web formats if needed.
 * 
 * @param url The original Cloudinary URL
 * @returns An optimized URL with f_auto,q_auto transformations
 */
export const getOptimizedUrl = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // If it's already optimized, don't double up
  if (url.includes('f_auto') || url.includes('f_auto,q_auto')) return url;

  // Insert f_auto,q_auto after /upload/
  if (url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }

  return url;
};
