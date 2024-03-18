import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({
        fileName: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        fileType: v.union(v.literal("image"), v.literal("pdf"), v.literal("csv"))
    }).index("by_orgid", ["orgId"]),

    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.string())
    }).index("by_token", ["tokenIdentifier"]),

    favorites: defineTable({
        fileId: v.id("files"),
        orgId: v.string(),
        userId: v.id("users"),
    }).index("by_userId_orgId_fileId", ["fileId", "orgId", "userId"]),
});