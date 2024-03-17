import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({
        fileName: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
    }).index("by_orgid", ["orgId"]),

    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.string())
    }).index("by_token", ["tokenIdentifier"])
});