import { PrismaClient } from '@prisma/client'
import { env } from '~/env.mjs'

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
        imageUrls: [
          'https://makeitdairyfree.com/wp-content/uploads/2021/08/IMG_9386-768x1024.jpg',
        ],
      },
      {
        name: 'Gluten-free Bread',
        description: 'Bread made from gluten-free flour',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '5',
        tagsIds: [glutenFree.id],
        donorId: alice.id,
        imageUrls: [
          'https://theloopywhisk.com/wp-content/uploads/2023/12/Gluten-Free-White-Bread_1200px-featured.jpg',
        ],
      },
      {
        name: 'Dairy-free Ice Cream',
        description: 'Ice cream made without dairy',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '8',
        tagsIds: [dairyFree.id],
        donorId: bob.id,
        imageUrls: [
          'https://www.natrel.ca/sites/default/files/images-package/Natrel_CremeGlaceeSL_2018_Vanille_EN.png',
        ],
      },
      {
        name: 'Halal Chicken',
        description: 'Halal chicken meat',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '15',
        tagsIds: [halal.id],
        donorId: bob.id,
        imageUrls: [
          'https://mynikmart.sg/cdn/shop/products/chickenbonelessleg_df1b3506-ef52-42e5-a114-e3ebe10032d5_1200x1200.jpg?v=1624358134',
        ],
      },
      {
        name: 'Kosher Fish',
        description: 'Kosher fish',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '12',
        tagsIds: [kosher.id],
        donorId: bob.id,
        imageUrls: [
          'https://mykosherfish.com/wp-content/uploads/2022/12/JONA-New-Product-Images-V2_Flounder-Fillets-630x630.png',
        ],
      },
      {
        name: 'Vegetarian Burger',
        description: 'Vegetarian burger with plant-based patty',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '20',
        tagsIds: [vegetarian.id],
        donorId: alice.id,
        imageUrls: [
          'https://www.thespruceeats.com/thmb/e-lll-PpJ5F-MF4C57LYag3IAB8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-vegan-black-bean-veggie-burgers-3377008-hero-05-f7c0f0d9865e48b6be52a4c76ee22438.jpg',
        ],
      },
      {
        name: 'Chicken Rice',
        description: 'Chicken rice with halal chicken',
        // 1 week from today
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        quantity: '25',
        tagsIds: [halal.id],
        donorId: alice.id,
        imageUrls: [
          'https://thehalalfoodblog.com/wp-content/uploads/2014/07/DSC03936.jpg',
        ],
      },
    ],
  })

  console.log('Created donations')

  // vectorize the donations
  for (const donation of donations) {
    const result = await fetch(`${env.ML_SERIVCE_URL}/vectorize_donation`, {
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

  console.log('Vectorized donations')
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
