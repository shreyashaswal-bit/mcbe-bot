const bedrock = require("bedrock-protocol")

function startBot() {
  const bot = bedrock.createClient({
    host: "Asnhuaswal.aternos.me",
    port: 56898,
    username: "IMMORTAL_BOT", // choose any name
    offline: true,             // OFFLINE MODE ✅
    version: "1.26.0"          // match server exactly
  })

  // Bot joined
  bot.on("join", () => {
    console.log(`${bot.username} joined the server ✅`)

    // Anti-AFK jump (every 6 seconds)
    setInterval(() => {
      bot.queue("player_action", { action: "jump" })
    }, 6000)

    // Random movement (every 5 seconds)
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
    }, 5000)
  })

  // Chat logger
  bot.on("text", packet => {
    console.log(packet.message)
  })

  // Auto-heal
  setInterval(() => {
    if (bot.health < bot.maxHealth) {
      bot.health = bot.maxHealth
      console.log("Healing to full health ❤️")
    }
  }, 2000)

  // Anti-fall damage
  setInterval(() => {
    if (bot.position.y < 1) {
      bot.queue("move_player_pos", {
        x: bot.position.x,
        y: 10,
        z: bot.position.z,
        yaw: bot.position.yaw,
        pitch: bot.position.pitch
      })
      console.log("Prevented fall damage ⬆️")
    }
  }, 1000)

  // Mob-fighting logic
  bot.on("entity_event", packet => {
    if (!packet) return
    const entityType = packet.type
    const isPlayer = packet.username ? true : false

    const mobsToAttack = ["zombie", "skeleton", "creeper", "spider", "enderman"]
    if (!isPlayer && mobsToAttack.includes(entityType?.toLowerCase())) {
      // Attack mob
      bot.queue("animate", { animation: 0 }) // swing hand
      console.log(`Attacking mob: ${entityType}`)
    }
  })

  // Auto-reconnect
  bot.on("disconnect", () => {
    console.log("Disconnected... reconnecting ⏳")
    setTimeout(startBot, 5000)
  })
}

startBot()
