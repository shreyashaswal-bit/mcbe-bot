const bedrock = require("bedrock-protocol")

function startBot(){

const bot = bedrock.createClient({
  host: "Asnhuaswal.aternos.me",
  port: 56898,
  username: "USHA",
  offline: true
})

let runtimeId = null
let pos = {x:0,y:0,z:0}

bot.on("start_game",(packet)=>{
runtimeId = packet.runtime_entity_id
})

bot.on("spawn",()=>{

console.log("USHA spawned in world")

// keep alive
setInterval(()=>{
try{
bot.queue("tick_sync",{
request_time:Date.now(),
response_time:Date.now()
})
}catch(e){}
},10000)


// random jumping
setInterval(()=>{
try{
bot.queue("player_action",{action:"jump"})
}catch(e){}
},4000+Math.random()*4000)


// random sneak
setInterval(()=>{
try{
bot.queue("player_action",{action:"start_sneak"})
setTimeout(()=>{
bot.queue("player_action",{action:"stop_sneak"})
},2000)
}catch(e){}
},20000+Math.random()*20000)


// arm swing
setInterval(()=>{
try{
bot.queue("animate",{
action_id:1,
runtime_entity_id:runtimeId
})
}catch(e){}
},7000+Math.random()*6000)


// random movement
setInterval(()=>{

if(!runtimeId) return

pos.x += (Math.random()-0.5)*2
pos.z += (Math.random()-0.5)*2

try{

bot.queue("move_player",{
runtime_id:runtimeId,
position:{
x:pos.x,
y:pos.y,
z:pos.z
},
pitch:Math.random()*30,
yaw:Math.random()*360,
head_yaw:Math.random()*360,
mode:3,
on_ground:true,
ridden_runtime_id:0
})

}catch(e){}

},5000+Math.random()*4000)


// random sprint
setInterval(()=>{
try{
bot.queue("player_action",{action:"start_sprint"})
setTimeout(()=>{
bot.queue("player_action",{action:"stop_sprint"})
},3000)
}catch(e){}
},30000+Math.random()*20000)


// random chat
const messages=[
"hi",
"anyone here?",
"nice world",
"lol",
"exploring",
"afk a bit",
"brb",
"cool base",
"lag?",
"hello"
]

setInterval(()=>{

try{

const msg=messages[Math.floor(Math.random()*messages.length)]

bot.queue("text",{
type:"chat",
needs_translation:false,
source_name:"USHA",
message:msg,
xuid:"",
platform_chat_id:""
})

}catch(e){}

},60000+Math.random()*120000)

})

bot.on("disconnect",()=>{
console.log("Disconnected. Reconnecting...")
setTimeout(startBot,15000)
})

bot.on("error",(err)=>{
console.log("Error:",err.message)
})

}

startBot()
