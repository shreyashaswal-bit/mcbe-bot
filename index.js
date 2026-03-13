const bedrock = require("bedrock-protocol")

function startBot() {
  const bot = bedrock.createClient({
    host: "Asnhuaswal.aternos.me",
    port: 56898,
    username: "USHA_BOT",   // choose any name
    offline: true            // OFFLINE MODE ✅
  })

  bot.on("join", () => {
    console.log(`${bot.username} joined the server ✅`)

    // Anti-AFK jump
    setInterval(() => {
      bot.queue("player_action", { action: "jump" })
    }, 4000)

    // Random movement to avoid standing still
    setInterval(() => {
      const dx = Math.random() * 2 - 1
      const dz = Math.random() * 2 - 1
      bot.queue("move_player_pos", {
        x: bot.position.x + dx,
        y: bot.position.y,
        z: bot.position.z + dz,
        yaw: bot.position.yaw,
        pitch: bot.position.pitch
      })
    }, 3000)
  })

  // Log chat
  bot.on("text", (packet) => {
    console.log(packet.message)
  })

  // Simple mob attacking logic
  bot.on("entity_event", (packet) => {
    if (!packet) return
    const entityType = packet.type
    const isPlayer = packet.username ? true : false

    const mobsToAttack = ["zombie", "skeleton", "creeper"]
    if (!isPlayer && mobsToAttack.includes(entityType?.toLowerCase())) {
      bot.queue("animate", { animation: 0 }) // swing hand
      console.log(`Attacking mob: ${entityType}`)
    }
  })

  // Auto-reconnect if disconnected
  bot.on("disconnect", () => {
    console.log("Disconnected... reconnecting ⏳")
    setTimeout(startBot, 5000)
  })
}

startBot()
