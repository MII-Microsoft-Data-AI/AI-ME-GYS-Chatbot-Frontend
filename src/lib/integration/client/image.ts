'use client'

const BaseAPIPath = '/api/be/v1/frontend/image';


export const getImageSrc = async (imageData: string): Promise<string> => {
  const safeURL = encodeURIComponent(imageData);
  const response = await fetch(`${BaseAPIPath}?data=${safeURL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.text()
}