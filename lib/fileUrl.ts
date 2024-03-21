import { Id } from "@/convex/_generated/dataModel";

export const getFileUrl = (fileId: Id<"_storage">) => `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;


const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
export function getFileImage(storageId: Id<"_storage"> ) {
  // e.g. https://happy-animal-123.convex.site/getImage?storageId=456
    const getImageUrl = new URL(`${convexSiteUrl}/getImage`);
    getImageUrl.searchParams.set("storageId", storageId);

    return getImageUrl.href;
}