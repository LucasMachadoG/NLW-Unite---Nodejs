import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.connection";
import { AttendeeNotFound } from "../errors/attendee.not.fount";

export async function getAttendeeBadge(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get("/attendees/:attendeeId/badge", {
    schema: {
      params: z.object({
        attendeeId: z.string().uuid()
      }),
      response: {
        200: z.object({
          badge: z.object({
            id: z.string().uuid(),
            nome: z.string(),
            email: z.string(),
            event: z.string(),
            checkInUrl: z.string()
          })
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try{
      const { attendeeId } = request.params
  
      const attendee = await prisma.attendee.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          id: attendeeId
        }
      })
  
      if(!attendee){
        throw new AttendeeNotFound()
      }

      const baseUrl = `${request.protocol}://${request.hostname}`

      const checkInURL = new URL(`/attendees/:${attendeeId}/check-in`, baseUrl)

      return reply.status(200).send({
        badge: {
          id: attendee.id,
          nome: attendee.name,
          email: attendee.email,
          event: attendee.event.title,
          checkInUrl: checkInURL.toString()
        }
      })
    } catch(error: any){
        if(error instanceof AttendeeNotFound){
          return reply.status(404).send({
            message: error.message
          })
        }
    }
  })
}