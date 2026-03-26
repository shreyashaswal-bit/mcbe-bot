const bedrock = require("bedrock-protocol");
const express = require("express");

const app = express();

// Uptime endpoint
app.get("/", (req, res) => {
  res.send("Bot is alive");
});

app.listen(3000, () => console.log("Web server running"));

function startBot() {
  const bot = bedrock.createClient({
    host: "Asnhuaswal.aternos.me",
    port: 56898,
    username: "AFK_BOT",
    offline: true
  });

  bot.on("join", () => {
    console.log("✅ Bot joined server!");

    // Anti-AFK (jump every 5 sec)
    setInterval(() => {
      bot.queue("player_action", { action: "jump" });
    }, 5000);
  });

  bot.on("disconnect", () => {
    console.log("❌ Disconnected! Reconnecting...");
    setTimeout(startBot, 5000);
  });

  bot.on("error", (err) => {
    console.log("⚠️ Error:", err.message);
  });
}

startBot();
