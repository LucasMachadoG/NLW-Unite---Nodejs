import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma.connection";
import { AttendeeCheckInAlreadyExists } from "../errors/attendee.checkin.already.existis";

export async function createCheckIN(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get("/attendees/:attendeeId/check-in", {
    schema: {
      params: z.object({
        attendeeId: z.string().uuid()
      }),
      response: {
        201: z.object({
          checkInId: z.string().uuid()
        }),
        409: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try{
      const { attendeeId } = request.params
  
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId
        }
      })
  
      if(attendeeCheckIn){
        throw new AttendeeCheckInAlreadyExists()
      }
  
      const checkIn = await prisma.checkIn.create({
        data: {
          attendeeId
        }
      })
  
      return reply.status(201).send({
        checkInId: checkIn.id
      })
    } catch(error: any){
      if(error instanceof AttendeeCheckInAlreadyExists){
        return reply.status(409).send({
          message: error.message
        })
      }
    }
  })
}