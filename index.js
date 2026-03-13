const bedrock = require("bedrock-protocol");

// CONFIG
const HOST = "Asnhuaswal.aternos.me";
const PORT = 56898;
const USERNAME = "USHA"; // offline username

const bot = bedrock.createClient({
  host: HOST,
  port: PORT,
  username: USERNAME,
  offline: true // offline mode
});

// EVENT: Bot connected
bot.on("connect", () => {
  console.log("✅ Bot connected (offline mode)");
});

// EVENT: Bot spawned in the world
bot.on("spawn", () => {
  console.log("🚀 Bot spawned in the world!");

  // Jump every 5 seconds
  setInterval(() => {
    bot.queue("player_action", { action: "jump" });
    console.log("⬆️ Bot jumped!");
  }, 5000);
});

// EVENT: Bot disconnected
bot.on("disconnect", (packet) => {
  console.log("❌ Bot disconnected:", packet.reason);
});

// EVENT: Error handler
bot.on("error", (err) => {
  console.error("⚠️ Error:", err.message);
});
