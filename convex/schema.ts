import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({
        fileName: v.string(),
        fileId: v.id("_storage"),
        userId: v.id("users"),
        orgId: v.string(),
        fileType: v.union(v.literal("image"), v.literal("pdf"), v.literal("csv")),
        toBeDeleted: v.optional(v.boolean()),
        fileTypeQuery: v.optional(v.string()),
    }).index("by_orgid", ["orgId"]).index("by_toBeDeleted", ["toBeDeleted"]),

    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.object({
            orgId: v.string(),
            role: v.union(v.literal("admin"), v.literal("member"))
        })),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
    }).index("by_token", ["tokenIdentifier"]),

    favorites: defineTable({
        fileId: v.id("files"),
        orgId: v.string(),
        userId: v.id("users"),
    }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
});