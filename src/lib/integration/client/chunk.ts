export interface ChunkData {
  content: string;
  filename: string;
  fileurl: string;
}

const BaseAPIPath = '/api/be/v1/frontend/chunk';

export const getDocChunkData = async (id: string): Promise<ChunkData> => {
  const res = await fetch(`${BaseAPIPath}/doc/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch chunk data');
  }
  return await res.json() as ChunkData;
}

export const getDocSumChunkData = async (id: string): Promise<ChunkData> => {
  const res = await fetch(`${BaseAPIPath}/docsum/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch chunk data');
  }
  return await res.json() as ChunkData;
}