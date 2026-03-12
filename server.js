const path = require('path')
const fastify = require('fastify')({ logger: true })

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/'
})

fastify.get('/api', async () => {
  return "Запрос прошел успешно"
})

const start = async () => {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
}

start()