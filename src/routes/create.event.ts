import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { generateSlug } from "../utils/generate.slug"
import { EventWithSameSlug } from "../errors/event.with.same.slug"
import { prisma } from "../lib/prisma.connection"
import { FastifyInstance } from "fastify"

export async function createEvent(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post("/events", {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendess: z.number().int().positive().nullable()
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid()
        }),
        409: z.object({
          message: z.string()
        })
      },
    }
  }, async (request, reply) => {
    try{
  
      const { title, details, maximumAttendess } = (request.body)
  
      const slug = generateSlug(title)
  
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug
        }
      })
  
      if(eventWithSameSlug){
        throw new EventWithSameSlug()
      }
  
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendess,
          slug: slug
        }
      })
  
      return reply.status(201).send({
        eventId: event.id
      })
    } catch(error: any){
      if(error instanceof EventWithSameSlug){
        return reply.status(409).send({
          message: error.message
        })
      }
    }
  })
}
