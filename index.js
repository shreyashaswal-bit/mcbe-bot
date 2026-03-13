const bedrock = require("bedrock-protocol")

function startBot(){

const bot = bedrock.createClient({
  host: "Asnhuaswal.aternos.me",
  port: 56898,
  username: "ALOOPAJI@OUTLOOK.COM",   // Microsoft account email
  offline: false,
  auth: "microsoft"
})

bot.on("join", () => {
  console.log("Bot joined server!")

  setInterval(() => {

    bot.queue("player_action", {
      action: "jump"
    })

  }, 5000)

})

bot.on("text", (packet) => {
  console.log(packet.message)
})

bot.on("disconnect", () => {
  console.log("Disconnected. Restarting...")
  setTimeout(startBot, 5000)
})

}

startBot()
