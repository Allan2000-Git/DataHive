export const getFileUrl = (fileId: string) => `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;