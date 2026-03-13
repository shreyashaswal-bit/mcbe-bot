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

  // random jump
  setInterval(() => {
    try{
      bot.queue("player_action", { action: "jump" })
    }catch(e){}
  }, 4000 + Math.random()*4000)

  // random head movement
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
        pitch: Math.random()*30,
        yaw: Math.random()*360,
        head_yaw: Math.random()*360,
        mode: 3,
        on_ground: true,
        ridden_runtime_id: 0
      })
    }catch(e){}

  }, 6000 + Math.random()*4000)

  // sneak occasionally
  setInterval(() => {
    try{
      bot.queue("player_action", { action: "start_sneak" })
      setTimeout(()=>{
        bot.queue("player_action", { action: "stop_sneak" })
      },2000)
    }catch(e){}
  }, 20000 + Math.random()*15000)

  // random chat messages
  const messages = [
    "hi",
    "anyone online?",
    "lol",
    "nice server",
    "afk for a bit",
    "brb"
  ]

  setInterval(() => {
    try{
      const msg = messages[Math.floor(Math.random()*messages.length)]
      bot.queue("text", {
        type: "chat",
        needs_translation: false,
        source_name: "USHA",
        message: msg,
        xuid: "",
        platform_chat_id: ""
      })
    }catch(e){}
  }, 60000 + Math.random()*60000)

  // keep alive ping
  setInterval(() => {
    try{
      bot.queue("tick_sync", {
        request_time: Date.now(),
        response_time: Date.now()
      })
    }catch(e){}
  }, 10000)

})

bot.on("disconnect", () => {
  console.log("Disconnected... reconnecting")
  setTimeout(startBot, 5000)
})

bot.on("error", err => {
  console.log("Error:", err.message)
})

}

startBot()
