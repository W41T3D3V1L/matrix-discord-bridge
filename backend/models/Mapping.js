import mongoose from "mongoose";

export default mongoose.model("Mapping", new mongoose.Schema({
  roomId: String,
  channelId: String
}));
