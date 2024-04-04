export class EventWithSameSlug extends Error{
  constructor(){
    super("Já existe um evento com esse mesmo nome!")
  }
}