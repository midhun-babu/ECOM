import Invitation from "../models/invitationModel.js";

export const insertInvitation = async (userData) => {
  return await Invitation.create(userData);
};

export const getInvitationByToken = async (token) => {
  return await Invitation.findOne({ token, status: "pending" });
};

export const getInvitationByEmail = async (email) => {
  return await Invitation.findOne({ email, status: "pending" });
};

export const updateInvitationStatus = async (id, status) => {
  return await Invitation.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

export const getAllInvitations = async (limit, skip) => {
  return await Invitation.find()
    .populate("invitedBy", "name email") 
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const permanentDelete = async (id) => {
  return await Invitation.findByIdAndDelete(id);
};
