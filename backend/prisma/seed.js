const { PrismaClient, Role, ProductStatus } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


async function main() {

	console.log('🌱 Running production seed...');


	const adminPassword = await bcrypt.hash(
		'Admin@123',
		10
	);


	await prisma.user.upsert({
		where: {
			email: 'admin@shopsphere.com'
		},
		update: {},
		create: {
			email: 'admin@shopsphere.com',
			passwordHash: adminPassword,
			role: Role.ADMIN
		}
	});


	console.log('✅ Admin created');

	// ============================
  // Categories
  // ============================

  const accessories = await prisma.category.upsert({
    where: {
      slug: 'accessories',
    },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'accessories',
    },
  });

  const premium = await prisma.category.upsert({
    where: {
      slug: 'premium-cases',
    },
    update: {},
    create: {
      name: 'Premium Cases',
      slug: 'premium-cases',
    },
  });

  // ============================
  // Products
  // ============================

  const magsafeCase = await prisma.product.upsert({
    where: {
      sku: 'CASE-IP17-MAGSAFE-BLK',
    },
    update: {},
    create: {
      name: 'MagSafe iPhone 17 Case',
      description: 'Premium MagSafe compatible case.',
      sku: 'CASE-IP17-MAGSAFE-BLK',
      price: 39.00,
      status: ProductStatus.ACTIVE,
      categoryId: premium.id,
    },
  });

  const clearCase = await prisma.product.upsert({
    where: {
      sku: 'CASE-IP17-CLEAR',
    },
    update: {},
    create: {
      name: 'Clear iPhone 17 Case',
      description: 'Transparent anti-yellow case.',
      sku: 'CASE-IP17-CLEAR',
      price: 29.00,
      status: ProductStatus.ACTIVE,
      categoryId: accessories.id,
    },
  });

  // ============================
  // Inventory
  // ============================

  await prisma.inventory.upsert({
    where: {
      productId: magsafeCase.id,
    },
    update: {},
    create: {
      productId: magsafeCase.id,
      quantity: 100,
      reserved: 0,
    },
  });

  await prisma.inventory.upsert({
    where: {
      productId: clearCase.id,
    },
    update: {},
    create: {
      productId: clearCase.id,
      quantity: 150,
      reserved: 0,
    },
  });

  console.log('✅ Database seeded successfully.');

}


main()
	.catch(console.error)
	.finally(async () => {
		await prisma.$disconnect();
	});