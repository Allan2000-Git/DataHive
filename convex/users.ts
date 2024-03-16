import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string()
    },
    handler: async (ctx, args) => {
        const {tokenIdentifier} = args;
        const user = await ctx.db.insert("users", {tokenIdentifier, orgIds:[]});
        return user;
    },
});

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const {tokenIdentifier, orgId} = args;
        const user = await ctx.db.query("users").withIndex("by_token", (user) => user.eq("tokenIdentifier", tokenIdentifier)).first();
        if(!user){
            throw new ConvexError("No user found");
        }
        await ctx.db.patch(user._id, {orgIds:[...user.orgIds, orgId]});
    },
});