import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

async function hasAccesstoOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user = await ctx.db.query("users").withIndex("by_token", (user) => user.eq("tokenIdentifier", tokenIdentifier)).first();
    if(!user){
        throw new ConvexError("No user found");
    }

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
    return hasAccess;
}

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
        throw new ConvexError("You are not authenticated to upload a file");
    }
    
    return await ctx.storage.generateUploadUrl();
});

export const getAllFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const {orgId, query} = args;
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            return [];
        }

        const hasAccess = await hasAccesstoOrg(ctx, identity.tokenIdentifier, orgId);
        if(!hasAccess){
            throw new ConvexError("You do not have access to the files in this organization");
        }

        // const files = await ctx.db.query("files").filter(file => file.eq(file.field("orgId"), orgId)).collect();
        let files = await ctx.db.query("files").withIndex("by_orgid", (file) => file.eq("orgId", orgId)).collect();

        if(query){
            files = files.filter((file) => file.fileName.toLowerCase().includes(query.toLowerCase()));
        }

        return files;
    },
});

export const createFile = mutation({
    args: {
        fileName: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        fileType: v.union(v.literal("image"), v.literal("pdf"), v.literal("csv"))
    },
    handler: async (ctx, args) => {
        const {fileName, fileId, orgId, fileType} = args;
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("You are not authenticated to upload a file");
        }

        const hasAccess = await hasAccesstoOrg(ctx, identity.tokenIdentifier, orgId);
        if(!hasAccess){
            throw new ConvexError("You do not have access to this organization");
        }

        const file = await ctx.db.insert('files', {fileName, fileId, orgId, fileType});
        return file;
    },
});

export const deleteFile = mutation({
    args: {
        fileId: v.id("files")
    },
    handler: async (ctx, args) => {
        const {fileId} = args;
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("You are not authenticated to delete a file");
        }

        const currentFile = await ctx.db.get(fileId);
        if(!currentFile){
            throw new ConvexError("Requested file does not exist");
        }

        const hasAccess = await hasAccesstoOrg(ctx, identity.tokenIdentifier, currentFile.orgId);
        if(!hasAccess){
            throw new ConvexError("You do not have access to this organization");
        }

        const file = await ctx.db.delete(fileId);
        return file;
    },
});