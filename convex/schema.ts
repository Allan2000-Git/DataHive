import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({
        fileName: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        fileType: v.union(v.literal("image"), v.literal("pdf"), v.literal("csv")),
        toBeDeleted: v.optional(v.boolean())
    }).index("by_orgid", ["orgId"]),

    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.object({
            orgId: v.string(),
            role: v.union(v.literal("admin"), v.literal("member"))
        })),
    }).index("by_token", ["tokenIdentifier"]),

    favorites: defineTable({
        fileId: v.id("files"),
        orgId: v.string(),
        userId: v.id("users"),
    }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
});