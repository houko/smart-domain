import { createClient } from 'redis'

export type RedisClient = ReturnType<typeof createClient>

let redisClient: RedisClient | null = null

export async function getRedisClient(): Promise<RedisClient> {
  if (!redisClient) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379'

    redisClient = createClient({
      url,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis: Max reconnection attempts reached')
            return false
          }
          return Math.min(retries * 100, 3000)
        },
      },
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    redisClient.on('connect', () => {
      console.log('Redis Client Connected')
    })

    await redisClient.connect()
  }

  return redisClient
}

export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
