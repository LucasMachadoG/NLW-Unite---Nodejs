import { prisma } from '../src/lib/prisma.connection'

async function seed() {
  await prisma.event.create({
    data: {
      id: "06647162-ebc9-4dbc-b6f4-6324f0735c53",
      title: "Unite Sumit",
      slug: 'unite-slug',
      details: "Um evento para devs",
      maximumAttendess: 120,
    }
  })
}

seed().then(() => {
  console.log('Database seeded.')
  prisma.$disconnect()
})