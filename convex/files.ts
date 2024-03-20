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
        query: v.optional(v.string()),
        isFavorite: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const {orgId, query, isFavorite} = args;
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

        if(isFavorite){
            const user = await ctx.db.query("users")
                    .withIndex("by_token", (user) => user.eq("tokenIdentifier", identity.tokenIdentifier)).first();
            
            if(!user){
                throw new ConvexError("No user found");
            }
            
            const favorites = await ctx.db.query("favorites")
                .withIndex("by_userId_orgId_fileId", (file) => file.eq("userId", user?._id).eq("orgId", orgId)).collect();

            files = files.filter((file) => favorites.some(favorite => favorite.fileId === file._id));
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

export const toggleFavorite = mutation({
    args: {
        fileId: v.id("files"),
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

        const user = await ctx.db.query("users")
                    .withIndex("by_token", (user) => user.eq("tokenIdentifier", identity.tokenIdentifier)).first();
        
        if(!user){
            throw new ConvexError("No user found");
        }

        const favorite = await ctx.db.query("favorites")
                        .withIndex("by_userId_orgId_fileId", (file) => file.eq("userId", user._id)
                        .eq("orgId", currentFile.orgId).eq("fileId", currentFile._id)).first();

        if(!favorite){
            await ctx.db.insert("favorites", {
                fileId: currentFile._id,
                orgId: currentFile.orgId,
                userId: user?._id
            })
        }else{
            await ctx.db.delete(favorite._id);
        }

        return favorite;
    },
});

export const getAllFavorites = query({
    args: {
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const {orgId} = args;
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            return [];
        }

        const hasAccess = await hasAccesstoOrg(ctx, identity.tokenIdentifier, orgId);
        if(!hasAccess){
            throw new ConvexError("You do not have access to the files in this organization");
        }

        const user = await ctx.db.query("users")
                    .withIndex("by_token", (user) => user.eq("tokenIdentifier", identity.tokenIdentifier)).first();
        
        if(!user){
            throw new ConvexError("No user found");
        }

        const favorites = await ctx.db.query("favorites")
                        .withIndex("by_userId_orgId_fileId", (file) => file.eq("userId", user._id).eq("orgId", orgId)).collect();
        
        return favorites;
    },
});