import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "../routes/create.event";
import { registerForEvent } from "../routes/register.for.event";
import { getEvent } from "../routes/get.event";
import { getAttendeeBadge } from "../routes/get.attendee.badge";
import { createCheckIN } from "../routes/create.checkin";
import { getEventAttendees } from "../routes/get.event.attendees";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

export const app = fastify()

app.register(fastifySwagger,  {
  swagger: {
    consumes: ['aplicaiton/json'],
    produces: ['aplication/json'],
    info: {
      title: 'pass-in',
      description: 'Especificações da API para o back-end',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(createCheckIN)
app.register(getEventAttendees)