import * as InvitationQueries from "../dbqueries/invitationQueries.js";
import crypto from "crypto";

export const createAndSendInvite = async ({ email, role, adminId }) => {
  if (!email || !role || !adminId) {
    throw new Error("Email, Role, and Admin ID are required");
  }

  const existingInvite = await InvitationQueries.getInvitationByEmail(email);
  if (existingInvite) {
    throw new Error("A pending invitation already exists for this email");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invitationData = {
    email,
    token,
    role,
    invitedBy: adminId,
    status: "pending"
  };

  const newInvite = await InvitationQueries.insertInvitation(invitationData);

  
  return newInvite;
};

export const validateInviteToken = async (token) => {
  if (!token) throw new Error("Token is required");

  const invite = await InvitationQueries.getInvitationByToken(token);

  if (!invite) {
    throw new Error("Invite link is invalid or has expired");
  }

  return invite; 
};

export const acceptInvitation = async (token) => {
  const invite = await validateInviteToken(token);
  const updatedInvite = await InvitationQueries.updateInvitationStatus(
    invite._id, 
    "accepted"
  );

  return updatedInvite;
};

export const getAdminInviteStats = async ({ limit, skip }) => {
  return await InvitationQueries.getAllInvitations(limit, skip);
};
