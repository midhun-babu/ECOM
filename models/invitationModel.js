import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  },
  token: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  invitedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'expired'], 
    default: 'pending' 
  },
  role: { 
    type: String, 
    required: true,
    enum: ["productmanager", "inventorymanager", "admin", "Dataanalyst", "user"],
  },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) 
  }
}, { timestamps: true }); 

invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation = mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema);

export default Invitation;
