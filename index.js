const bedrock = require("bedrock-protocol");

// CHANGE THESE
const HOST = "Asnhuaswal.aternos.me";
const PORT = 56898;
const USERNAME = "USHA"; // offline username

const bot = bedrock.createClient({
  host: HOST,
  port: PORT,
  username: USERNAME,
  offline: true // offline mode
});

// === EVENTS ===
bot.on("connect", () => {
  console.log("✅ Bot connected (offline mode)");
});

bot.on("spawn", () => {
  console.log("🚀 Bot spawned in the world!");

  // Anti-AFK jump every 6 seconds
  setInterval(() => {
    bot.queue("player_action", { action: "jump" });
  }, 6000);

  // Anti-fall / teleport up if falling
  setInterval(() => {
    if (!bot.position) return;
    if (bot.position.y < 1) {
      bot.queue("move_player_pos", {
        x: bot.position.x,
        y: 10,
        z: bot.position.z,
        yaw: bot.position.yaw,
        pitch: bot.position.pitch
      });
      console.log("⬆️ Prevented fall damage!");
    }
  }, 1000);
});

// Fight mobs only
bot.on("entity_spawn", (entity) => {
  if (entity.type === "mob") {
    console.log(`⚔️ Mob spotted: ${entity.type}`);
    bot.queue("mob_attack", { runtimeEntityId: entity.id });
  }
});

bot.on("disconnect", (packet) => {
  console.log("❌ Bot disconnected:", packet.reason);
});

bot.on("error", (err) => {
  console.error("⚠️ Error:", err.message);
});
