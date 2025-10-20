'use client'

const BaseAPIPath = '/api/be/v1/frontend/image';


export const getImageSrc = async (imageData: string): Promise<string> => {
  const safeURL = encodeURIComponent(imageData);
  const finalUrl = `${BaseAPIPath}?data=${safeURL}`
  console.log(finalUrl)
  const response = await fetch(finalUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  let result = await response.text()
  
  // Decode HTML entities and remove parentheses/quotes
  result = result
    .replace(/&quot;/g, '"')  // Decode &quot;
    .replace(/&amp;/g, '&')   // Decode &amp;
    .replace(/^\(|\)$/g, '')  // Remove parentheses
    .replace(/^"|"$/g, '')    // Remove surrounding quotes
    .trim()
  
  console.log("RES", result)
  return result
}