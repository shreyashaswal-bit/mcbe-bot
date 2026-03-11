const bedrock = require("bedrock-protocol")

const host = "Asnhuaswal.aternos.me"
const port = 56898

function startBot() {

  const bot = bedrock.createClient({
    host: host,
    port: port,
    username: "AFKBot"
  })

  bot.on("join", () => {
    console.log("Bot joined server")

    setInterval(() => {

      console.log("Anti-AFK movement")

      // random small movement (2x2 area)
      const x = (Math.random() - 0.5) * 2
      const z = (Math.random() - 0.5) * 2

      bot.queue("move_player", {
        runtime_id: 1,
        position: { x: x, y: 0, z: z },
        pitch: Math.random() * 360,
        yaw: Math.random() * 360,
        head_yaw: Math.random() * 360,
        mode: 0,
        on_ground: true,
        ridden_runtime_id: 0
      })

      // jump
      bot.queue("player_action", {
        action_id: 8
      })

    }, 6000)

  })

  bot.on("disconnect", () => {
    console.log("Disconnected — reconnecting in 5s")
    setTimeout(startBot, 5000)
  })

}

startBot()
