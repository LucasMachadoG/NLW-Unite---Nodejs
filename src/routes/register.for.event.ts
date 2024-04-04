import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma.connection";
import { AttendeeWithSameEmail } from "../errors/attendee.with.same.email";
import { EventMaxAttendees } from "../errors/event.max.attendees";

export async function registerForEvent(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/events/:eventId/attendees", {
    schema: {
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.string().uuid()
        }),
        409: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try{
      const { name, email } = request.body
      const { eventId } = request.params

      const [ event, eventMaxAttendees ] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId
          }
        }),
        prisma.attendee.count({
          where: {
            eventId
          }
        })
      ])

      if(event?.maximumAttendess && eventMaxAttendees >= event?.maximumAttendess){
        throw new EventMaxAttendees()
      }

      const attendeeWithSameEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId
          }
        }
      })

      if(attendeeWithSameEmail){
        throw new AttendeeWithSameEmail()
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      })

      return reply.status(201).send({
        attendeeId: attendee.id
      })
    } catch(error: any){
      if(error instanceof AttendeeWithSameEmail){
        return reply.status(409).send({
          message: error.message
        })
      } else if(error instanceof EventMaxAttendees){
        return reply.status(409).send({
          message: error.message
        })
      }
    }
  })
} 