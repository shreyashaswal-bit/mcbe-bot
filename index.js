const bedrock = require("bedrock-protocol")

function startBot(){

const bot = bedrock.createClient({
  host: "Asnhuaswal.aternos.me",
  port: 56898,
  username: "USHA",
  offline: true
})

bot.on("join", () => {

  console.log("USHA joined server")

  setInterval(() => {
    bot.queue("player_action", { action: "jump" })
  }, 4000)

  // keep alive
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
  console.log(err)
})

}

startBot()
