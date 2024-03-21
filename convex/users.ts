import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {
    const user = await ctx.db.query("users")
                    .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
    ).first();

    if (!user) {
        throw new ConvexError({message: "No user found"});
    }

    return user;
}

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.string(),
        image: v.string()
    },
    handler: async (ctx, args) => {
        const {tokenIdentifier, name, image} = args;
        const user = await ctx.db.insert("users", {tokenIdentifier, orgIds:[], name, image});
        return user;
    },
});

export const updateUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        name: v.string(),
        image: v.string()
    },
    handler: async (ctx, args) => {
        const {tokenIdentifier, name, image} = args;
        const user = await ctx.db.query("users").withIndex("by_token", (user) => user.eq("tokenIdentifier", tokenIdentifier)).first();

        if (!user) {
            throw new ConvexError({message: "No user found"});
        }

        const updatedUser = await ctx.db.patch(user?._id, {name, image});
        return updatedUser;
    },
});

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string(),
        role: v.union(v.literal("admin"), v.literal("member")),
    },
    handler: async (ctx, args) => {
        const {tokenIdentifier, orgId, role} = args;
        const user = await ctx.db.query("users").withIndex("by_token", (user) => user.eq("tokenIdentifier", tokenIdentifier)).first();
        if(!user){
            throw new ConvexError({message: "No user found"});
        }
        await ctx.db.patch(user._id, {orgIds:[...user.orgIds, {orgId, role}]});
    },
});

export const updateRoleInOrgForUser = internalMutation({
    args: { 
        tokenIdentifier: v.string(), 
        orgId: v.string(), 
        role: v.union(v.literal("admin"), v.literal("member")), 
    },
    async handler(ctx, args) {
        const {tokenIdentifier, orgId, role} = args;
        const user = await getUser(ctx, tokenIdentifier);
    
        const org = user.orgIds.find((org) => org.orgId === orgId);
    
        if (!org) {
            throw new ConvexError({message: "Expected to have an organization on the user but was not found while updating"});
        }
    
        org.role = role;
    
        await ctx.db.patch(user._id, {
            orgIds: user.orgIds,
        });
    },
});

export const getUserDetails = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        const {userId} = args;
        const user = await ctx.db.get(userId);
        if(!user){
            return null;
        }
        return user;
    },
});