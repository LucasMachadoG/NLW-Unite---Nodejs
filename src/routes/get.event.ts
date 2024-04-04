import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.connection";
import { EventNotFound } from "../errors/event.not.found";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get("/event/:eventId", {
    schema: {
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: z.object({
          event: z.object({
            id: z.string().uuid(),
            title: z.string(),
            slug: z.string(),
            details: z.string().nullable(),
            maximumAttendees: z.number().int().nullable(),
            attendeesAmount: z.number().int()
          })
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try{
      const { eventId } = request.params
  
      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendess: true,
          _count: {
            select: {
              Attendee: true
            }
          }
        },
        where: {
          id: eventId
        }
      })
  
      if(!event){
        throw new EventNotFound()
      }
  
      return reply.status(200).send({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendees: event.maximumAttendess,
          attendeesAmount: event._count.Attendee
        }
      })
    } catch(error: any){
      if(error instanceof EventNotFound){
        return reply.status(404).send({
          message: error.message
        })
      }
    }
  })
}