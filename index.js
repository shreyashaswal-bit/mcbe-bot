const bedrock = require("bedrock-protocol");

const HOST = "Asnhuaswal.aternos.me";
const PORT = 56898;
const USERNAME = "USHA";

const bot = bedrock.createClient({
  host: HOST,
  port: PORT,
  username: USERNAME,
  offline: true
});

let entityReady = false;

bot.on("connect", () => {
  console.log("✅ Bot connected (offline mode)");
});

bot.on("spawn", () => {
  console.log("🚀 Bot spawned in the world!");
  entityReady = true;

  setInterval(() => {
    if (!entityReady) return; // wait for entity to be ready
    try {
      bot.queue("player_action", { action: "jump" });
      console.log("⬆️ Bot jumped!");
    } catch (err) {
      console.log("⚠️ Skipping jump, entity not ready yet");
    }
  }, 5000); // jump every 5 sec
});

bot.on("disconnect", (packet) => {
  console.log("❌ Bot disconnected by server:", packet.reason);
});

bot.on("error", (err) => {
  console.error("⚠️ Error:", err.message);
});
