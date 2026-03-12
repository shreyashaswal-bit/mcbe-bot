const bedrock = require("bedrock-protocol")

function startBot(){

const bot = bedrock.createClient({
  host: "Asnhuaswal.aternos.me",
  port: 56898,
  username: "USHA",
  offline: true
})

let runtimeId = null

bot.on("start_game", (packet) => {
  runtimeId = packet.runtime_entity_id
})

bot.on("join", () => {
  console.log("USHA joined server")

  // Jump every 5 seconds
  setInterval(() => {
    try{
      bot.queue("player_action", { action: "jump" })
    }catch(e){}
  }, 5000)

  // Random look movement
  setInterval(() => {

    if(!runtimeId) return

    try{
      bot.queue("move_player", {
        runtime_id: runtimeId,
        position: {
          x: Math.random()*2,
          y: 0,
          z: Math.random()*2
        },
        pitch: Math.random()*20,
        yaw: Math.random()*360,
        head_yaw: Math.random()*360,
        mode: 3,
        on_ground: true,
        ridden_runtime_id: 0
      })
    }catch(e){}

  }, 7000)

})

bot.on("disconnect", () => {
  console.log("Disconnected... reconnecting in 10s")
  setTimeout(startBot, 10000)
})

bot.on("error", err => {
  console.log("Error:", err.message)
})

}

startBot()
