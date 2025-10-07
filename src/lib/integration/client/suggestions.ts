'use client'
export type SuggestionsType = string[]

const BaseAPIPath = '/api/be/v1/frontend/suggestions';

export const getSuggestions = async (): Promise<SuggestionsType> => {
  const res = await fetch(`${BaseAPIPath}`);
  if (!res.ok) {
    throw new Error('Failed to fetch chunk data');
  }
  return await res.json() as SuggestionsType;
}