export class EventMaxAttendees extends Error{
  constructor(){
    super("Este evento já esta com todas as vagas lotadas.")
  }
}