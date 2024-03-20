import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";

export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {
    const user = await ctx.db.query("users")
                    .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
    ).first();

    if (!user) {
        throw new ConvexError("expected user to be defined");
    }

    return user;
}

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
        role: v.union(v.literal("admin"), v.literal("member")),
    },
    handler: async (ctx, args) => {
        const {tokenIdentifier, orgId, role} = args;
        const user = await ctx.db.query("users").withIndex("by_token", (user) => user.eq("tokenIdentifier", tokenIdentifier)).first();
        if(!user){
            throw new ConvexError("No user found");
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
            throw new ConvexError("Expected to have an organization on the user but was not found while updating");
        }
    
        org.role = role;
    
        await ctx.db.patch(user._id, {
            orgIds: user.orgIds,
        });
    },
});