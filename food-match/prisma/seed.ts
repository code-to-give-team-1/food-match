import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // create dummy users
  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        name: 'Alice',
        email: 'alice@example.com',
        emailVerified: new Date(),
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        emailVerified: new Date(),
      },
    ],
  })

  const alice = users.find((user) => user.name === 'Alice')
  const bob = users.find((user) => user.name === 'Bob')

  if (!alice || !bob) {
    throw new Error('Could not find users')
  }

  console.log('Created users')

  // create tags
  const tags = await prisma.tag.createManyAndReturn({
    data: [
      { name: 'Vegetarian' },
      { name: 'Vegan' },
      { name: 'Gluten-free' },
      { name: 'Dairy-free' },
      { name: 'Halal' },
      { name: 'Kosher' },
    ],
  })

  console.log('Created tags')

  const vegetarian = tags.find((tag) => tag.name === 'Vegetarian')
  const vegan = tags.find((tag) => tag.name === 'Vegan')
  const glutenFree = tags.find((tag) => tag.name === 'Gluten-free')
  const dairyFree = tags.find((tag) => tag.name === 'Dairy-free')
  const halal = tags.find((tag) => tag.name === 'Halal')
  const kosher = tags.find((tag) => tag.name === 'Kosher')

  if (!vegetarian || !vegan || !glutenFree || !dairyFree || !halal || !kosher) {
    throw new Error('Could not find tags')
  }

  // create donations
  const donations = await prisma.donation.createManyAndReturn({
    data: [
      {
        name: 'Vegan Pizza',
        description: 'Vegan pizza with vegan cheese',
        // one day before today
        expiry: new Date(Date.now() - 24 * 60 * 60 * 1000),
        quantity: '10',
        tagsIds: [vegetarian.id, vegan.id],
        donorId: alice.id,
        beneficiaryId: bob.id,
        passCode: '123456',
      },
      {
        name: 'Gluten-free Bread',
        description: 'Bread made from gluten-free flour',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '5',
        tagsIds: [glutenFree.id],
        donorId: alice.id,
      },
      {
        name: 'Dairy-free Ice Cream',
        description: 'Ice cream made without dairy',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '8',
        tagsIds: [dairyFree.id],
        donorId: bob.id,
      },
      {
        name: 'Halal Chicken',
        description: 'Halal chicken meat',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '15',
        tagsIds: [halal.id],
        donorId: bob.id,
      },
      {
        name: 'Kosher Fish',
        description: 'Kosher fish',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '12',
        tagsIds: [kosher.id],
        donorId: bob.id,
      },
    ],
  })

  // vectorize the donations
  for (const donation of donations) {
    const result = await fetch('http://localhost:5001/vectorize_donation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donationId: donation.id,
      }),
    })

    if (!result.ok) {
      console.error('Failed to vectorize donation')
      throw new Error('Failed to vectorize donation')
    }
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
