const bedrock = require("bedrock-protocol")

function startBot() {
  const bot = bedrock.createClient({
    host: "Asnhuaswal.aternos.me",
    port: 56898,
    username: "IMMORTAL_SURVIVAL_BOT",
    offline: true
  })

  // Bot joined
  bot.on("join", () => {
    console.log(`${bot.username} joined server ✅`)

    // Anti-AFK jump
    setInterval(() => {
      bot.queue("player_action", { action: "jump" })
    }, 4000)

    // Random movement
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
      // Walk toward mob
      bot.queue("move_player_pos", {
        x: bot.position.x + (Math.random() - 0.5),
        y: bot.position.y,
        z: bot.position.z + (Math.random() - 0.5),
        yaw: bot.position.yaw,
        pitch: bot.position.pitch
      })
      // Attack
      bot.queue("animate", { animation: 0 })
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
