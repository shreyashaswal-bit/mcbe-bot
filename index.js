const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Bot is alive!'))
app.listen(process.env.PORT || 3000)

const client = bedrock.createClient({
  host: 'aloopaji.falixsrv.me', // replace with your server IP
  port: 37531,
  username: 'KeepAliveBot',
  offline: true
})

client.on('spawn', () => {
  console.log('✅ Bot joined!')

  setInterval(() => {
    client.queue('player_action', {
      runtime_entity_id: client.entityId,
      action: 'jump',
      block_position: { x: 0, y: 0, z: 0 },
      result_position: { x: 0, y: 0, z: 0 },
      face: 0
    })
    console.log('⬆️ Bot jumped!')
  }, 10000)
})

client.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason)
  // Auto reconnect after 5 seconds
  setTimeout(() => process.exit(1), 5000)
})

client.on('error', (err) => {
  console.log('⚠️ Error:', err)
})
