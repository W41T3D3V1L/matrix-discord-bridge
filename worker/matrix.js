import sdk from "matrix-js-sdk";
import { CONFIG } from "./config.js";
import { mappings } from "./database.js";
import { discord } from "./discord.js";

export const matrixClient = sdk.createClient({
  baseUrl: CONFIG.matrix.homeserver
});

let lastTimestamp = Date.now();

// 🔥 GET CLEAN NAME
async function getName(userId) {
  try {
    const profile = await matrixClient.getProfileInfo(userId);
    return profile.displayname
      ? profile.displayname
      : userId.split(":")[0].replace("@", "");
  } catch {
    return userId.split(":")[0].replace("@", "");
  }
}

// 🔥 SAFE IMAGE SEND WITH USERNAME
async function safeSend(channel, name, url, type = "image") {
  try {
    await channel.send({
      content: `${name} (Matrix) sent a ${type}`,
      files: [url]
    });
  } catch {
    console.log("⚠️ Image failed");

    // fallback
    await channel.send(`${name} (Matrix): ${type} uploaded`);
  }
}

export async function startMatrix() {
  const res = await matrixClient.login("m.login.password", {
    user: CONFIG.matrix.user,
    password: CONFIG.matrix.password
  });

  matrixClient.setAccessToken(res.access_token);
  matrixClient.startClient();

  console.log("✅ Matrix connected");

  matrixClient.on("Room.timeline", async (event, room, toStartOfTimeline) => {
    try {
      if (toStartOfTimeline) return;
      if (event.getType() !== "m.room.message") return;

      const eventTime = event.getTs();
      if (eventTime < lastTimestamp) return;

      const map = await mappings.findOne({ roomId: room.roomId });
      if (!map) return;

      const sender = event.getSender();
      if (sender === CONFIG.matrix.user) return;

      const content = event.getContent();
      const channel = await discord.channels.fetch(map.channelId);
      if (!channel) return;

      const name = await getName(sender);

      // 🔥 IMAGE
      if (content.msgtype === "m.image" && content.url) {
        const parts = content.url.replace("mxc://", "").split("/");
        const server = parts[0];
        const mediaId = parts[1];

        const imageUrl = `https://matrix.org/_matrix/media/v3/download/${server}/${mediaId}`;

        await safeSend(channel, name, imageUrl, "image");

        lastTimestamp = eventTime;
        return;
      }

      // 🔥 STICKER
      if (content.msgtype === "m.sticker" && content.url) {
        const parts = content.url.replace("mxc://", "").split("/");
        const server = parts[0];
        const mediaId = parts[1];

        const imageUrl = `https://matrix.org/_matrix/media/v3/download/${server}/${mediaId}`;

        await safeSend(channel, name, imageUrl, "sticker");

        lastTimestamp = eventTime;
        return;
      }

      const text = content.body;

      // 🔥 LINKS
      if (text.startsWith("http")) {
        await channel.send(`${name} (Matrix): ${text}`);
        lastTimestamp = eventTime;
        return;
      }

      // 🔥 NORMAL TEXT
      await channel.send(`${name} (Matrix): ${text}`);

      lastTimestamp = eventTime;

    } catch (err) {
      console.error("❌ Matrix → Discord error:", err);
    }
  });
}
