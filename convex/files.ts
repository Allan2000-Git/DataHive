import { Doc, Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
        throw new ConvexError("You must be logged in to upload a file");
    }
    
    return await ctx.storage.generateUploadUrl();
});

async function hasAccesstoOrg(ctx: QueryCtx | MutationCtx,  orgId: string) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        return null;
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .first();

    if (!user) {
        return null;
    }

    const hasAccess =
        user.orgIds.some((item) => item.orgId === orgId) ||
        user.tokenIdentifier.includes(orgId);

    if (!hasAccess) {
        return null;
    }

    return { user };
}

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">) {
    const file = await ctx.db.get(fileId);

    if (!file) {
        return null;
    }

    const hasAccess = await hasAccesstoOrg(ctx, file.orgId);

    if (!hasAccess) {
        return null;
    }

    return { user: hasAccess.user, file };
}

export const getAllFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        isFavorite: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const {orgId, query, isFavorite} = args;
        const hasAccess = await hasAccesstoOrg(ctx, args.orgId);

        if (!hasAccess) {
        return [];
        }

        // const files = await ctx.db.query("files").filter(file => file.eq(file.field("orgId"), orgId)).collect();
        let files = await ctx.db.query("files").withIndex("by_orgid", (file) => file.eq("orgId", orgId)).collect();

        if(query){
            files = files.filter((file) => file.fileName.toLowerCase().includes(query.toLowerCase()));
        }

        if(isFavorite){
            const favorites = await ctx.db.query("favorites")
                .withIndex("by_userId_orgId_fileId", (file) => file.eq("userId", hasAccess.user?._id).eq("orgId", orgId)).collect();

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
        const hasAccess = await hasAccesstoOrg(ctx, args.orgId);

        if (!hasAccess) {
        throw new ConvexError("you do not have access to this org");
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
        const hasAccess = await hasAccessToFile(ctx, fileId);

        if (!hasAccess) {
            throw new ConvexError({message: "No access to file"});
        }
        
        const isAdmin = hasAccess.user.orgIds.find((org) => org.orgId === hasAccess.file.orgId)?.role === "admin";
        if(!isAdmin){
            throw new ConvexError({message: "Only admin of this organization can delete files"});
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
        const access = await hasAccessToFile(ctx, args.fileId);

        if (!access) {
            throw new ConvexError("no access to file");
        }

        const favorite = await ctx.db.query("favorites")
                        .withIndex("by_userId_orgId_fileId", (file) => file.eq("userId", access.user._id)
                        .eq("orgId", access.file.orgId).eq("fileId", access.file._id)).first();

        if(!favorite){
            await ctx.db.insert("favorites", {
                fileId: access.file._id,
                orgId: access.file.orgId,
                userId: access.user?._id
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
        const hasAccess = await hasAccesstoOrg(ctx, args.orgId);

        if (!hasAccess) {
        return [];
        }

        const favorites = await ctx.db.query("favorites")
                        .withIndex("by_userId_orgId_fileId", (file) => file.eq("userId", hasAccess.user._id).eq("orgId", orgId)).collect();
        
        return favorites;
    },
});