export class AttendeeCheckInAlreadyExists extends Error{
  constructor(){
    super("Participando já fez o check-in")
  }
}