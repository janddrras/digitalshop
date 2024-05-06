import dotenv from "dotenv"
import path from "path"
import type { InitOptions } from "payload/config"
import payload, { Payload } from "payload"
import { init } from "next/dist/compiled/webpack/webpack"

dotenv.config({ path: path.resolve(__dirname, "../../.env") })

let cached = (global as any).getPayloadClient

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null
  }
}

interface Args {
  initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async ({ initOptions }: Args = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing")
  }

  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {})
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}