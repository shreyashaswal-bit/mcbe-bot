const bedrock = require("bedrock-protocol");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("Bot is alive"));
app.listen(process.env.PORT || 3000, "0.0.0.0");

function startBot() {
  const bot = bedrock.createClient({
    host: "Asnhuaswal.aternos.me",
    port: 56898,
    username: "AFK_BOT",
    offline: true,
    version: "1.26.0"
  });

  bot.on("join", () => {
    console.log("✅ Bot joined 1.26.0 server!");

    setInterval(() => {
      try {
        bot.queue("player_action", { action: "jump" });
        bot.queue("move_player", {
          runtime_id: bot.runtime_entity_id,
          position: { x: 0, y: 100, z: 0 },
          pitch: 0,
          yaw: Math.random() * 360,
          head_yaw: 0,
          mode: 0,
          on_ground: true,
          tick: 0
        });
      } catch {}
    }, 6000);
  });

  bot.on("disconnect", (packet) => {
    console.log("❌ Disconnected:", packet);
    setTimeout(startBot, 5000);
  });

  bot.on("error", (err) => console.log("⚠️ Error:", err.message));
}

startBot();
