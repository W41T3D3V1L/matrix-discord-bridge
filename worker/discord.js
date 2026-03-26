import { Client, GatewayIntentBits } from "discord.js";
import { mappings } from "./database.js";

export const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

export function setupDiscord(matrixClient) {
  discord.on("ready", () => {
    console.log(`🤖 Logged in as ${discord.user.tag}`);
  });

  discord.on("messageCreate", async (msg) => {
    try {
      if (msg.author.bot) return;

      const map = await mappings.findOne({
        channelId: msg.channel.id
      });

      if (!map) return;

      // 🔥 EMOJI FIX
      let text = msg.content || "";
      text = text.replace(/<a?:\w+:(\d+)>/g, (match, id) => {
        return `https://cdn.discordapp.com/emojis/${id}.png`;
      });

      if (text) {
        await matrixClient.sendEvent(map.roomId, "m.room.message", {
          msgtype: "m.text",
          body: `${msg.author.username} (Discord): ${text}`
        });
      }

      // 🔥 FILES
      if (msg.attachments.size > 0) {
        for (const file of msg.attachments.values()) {
          await matrixClient.sendEvent(map.roomId, "m.room.message", {
            msgtype: "m.image",
            body: file.name,
            url: file.url
          });
        }
      }

      // 🔥 STICKERS
      if (msg.stickers.size > 0) {
        for (const sticker of msg.stickers.values()) {
          await matrixClient.sendEvent(map.roomId, "m.room.message", {
            msgtype: "m.image",
            body: sticker.name || "sticker",
            url: sticker.url
          });
        }
      }

    } catch (err) {
      console.error("❌ Discord → Matrix error:", err);
    }
  });
}
