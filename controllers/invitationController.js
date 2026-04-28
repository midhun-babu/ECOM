import * as invitationService from "../services/invitationService.js";
import { sendInvitationEmail } from "../services/emailService.js";

export const sendInvitation = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const adminId = req.user.id; 
    const invitation = await invitationService.createAndSendInvite({
      email,
      role,
      adminId,
    });

    await sendInvitationEmail(invitation.email, invitation.role, invitation.token);

    return res.status(201).json({
      success: true,
      message: `Invitation successfully sent to ${email}`,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const verifyInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await invitationService.validateInviteToken(token);

    return res.status(200).json({
      success: true,
      data: {
        email: invitation.email,
        role: invitation.role,
      },
    });
  } catch (error) {
    return res.status(410).json({ 
      success: false, 
      message: "Invitation link is invalid or has expired." 
    });
  }
};

export const listInvitations = async (req, res) => {
  try {
    const { limit, skip } = req.pagination;

    const invites = await invitationService.getAdminInviteStats({ limit, skip });

    return res.status(200).json({ 
      success: true, 
      data: invites 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
