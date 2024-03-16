import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getAllFiles = query({
    args: {
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            return [];
        }

        const hasAccess = await hasAccesstoOrg(ctx, identity.tokenIdentifier, args.orgId);
        if(!hasAccess){
            throw new ConvexError("You do not have access to the files in this organization");
        }

        // const files = await ctx.db.query("files").filter(file => file.eq(file.field("orgId"), orgId)).collect();
        const files = await ctx.db.query("files").withIndex("by_orgid", (file) => file.eq("orgId", args.orgId)).collect();
        return files;
    },
});

export const createFile = mutation({
    args: {
        fileName: v.string(),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const {fileName, orgId} = args;
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("You are not authenticated to upload a file");
        }

        const hasAccess = await hasAccesstoOrg(ctx, identity.tokenIdentifier, orgId);
        if(!hasAccess){
            throw new ConvexError("You do not have access to this organization");
        }

        const file = await ctx.db.insert('files', {fileName, orgId});
        return file;
    },
});

async function hasAccesstoOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user = await ctx.db.query("users").withIndex("by_token", (user) => user.eq("tokenIdentifier", tokenIdentifier)).first();
    if(!user){
        throw new ConvexError("No user found");
    }

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
    return hasAccess;
}