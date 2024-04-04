export class AttendeeWithSameEmail extends Error{
  constructor(){
    super("Email já cadastrado para esse evento.")
  }
}