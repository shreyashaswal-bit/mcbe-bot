const bedrock = require("bedrock-protocol");
const express = require("express");

const app = express();

// Simple web server for UptimeRobot
app.get("/", (req, res) => res.send("Bot is alive"));
app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Web server running"));

function startBot() {
  const bot = bedrock.createClient({
    host: "Asnhuaswal.aternos.me", // Your Aternos IP
    port: 56898,                    // Your Aternos Port
    username: "AFK_BOT",            // Bot username
    offline: true,                  // Offline mode
    version: "1.26.0"               // Force server version
  });

  bot.on("join", () => {
    console.log("✅ Bot joined server!");

    // Anti-AFK: jump + tiny random rotation
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
    console.log("❌ Disconnected! Reconnecting in 5 sec...", packet);
    setTimeout(startBot, 5000); // Auto reconnect
  });

  bot.on("error", (err) => console.log("⚠️ Error:", err.message));
}

// Start bot
startBot();
