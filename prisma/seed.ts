import { PrismaClient, RecordType, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@finance.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const analystPassword = await bcrypt.hash('analyst123', 10);
  const analyst = await prisma.user.create({
    data: {
      name: 'Analyst User',
      email: 'analyst@finance.com',
      password: analystPassword,
      role: Role.ANALYST,
    },
  });

  const viewerPassword = await bcrypt.hash('viewer123', 10);
  await prisma.user.create({
    data: {
      name: 'Viewer User',
      email: 'viewer@finance.com',
      password: viewerPassword,
      role: Role.VIEWER,
    },
  });

  // Create financial records
  const records = [
    { amount: 5000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-01-01'), createdById: admin.id },
    { amount: 200, type: RecordType.EXPENSE, category: 'Groceries', date: new Date('2024-01-02'), createdById: admin.id },
    { amount: 1500, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-01-05'), createdById: admin.id },
    { amount: 50, type: RecordType.EXPENSE, category: 'Transport', date: new Date('2024-01-07'), createdById: admin.id },
    { amount: 100, type: RecordType.INCOME, category: 'Freelance', date: new Date('2024-01-10'), createdById: admin.id },
    { amount: 300, type: RecordType.EXPENSE, category: 'Utilities', date: new Date('2024-01-12'), createdById: admin.id },
    { amount: 75, type: RecordType.EXPENSE, category: 'Entertainment', date: new Date('2024-01-15'), createdById: admin.id },
    { amount: 5000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-02-01'), createdById: admin.id },
    { amount: 250, type: RecordType.EXPENSE, category: 'Groceries', date: new Date('2024-02-03'), createdById: admin.id },
    { amount: 1500, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-02-05'), createdById: admin.id },
    { amount: 60, type: RecordType.EXPENSE, category: 'Transport', date: new Date('2024-02-08'), createdById: admin.id },
    { amount: 200, type: RecordType.INCOME, category: 'Freelance', date: new Date('2024-02-11'), createdById: admin.id },
    { amount: 320, type: RecordType.EXPENSE, category: 'Utilities', date: new Date('2024-02-13'), createdById: admin.id },
    { amount: 120, type: RecordType.EXPENSE, category: 'Entertainment', date: new Date('2024-02-16'), createdById: admin.id },
    { amount: 5000, type: RecordType.INCOME, category: 'Salary', date: new Date('2024-03-01'), createdById: admin.id },
    { amount: 220, type: RecordType.EXPENSE, category: 'Groceries', date: new Date('2024-03-02'), createdById: admin.id },
    { amount: 1500, type: RecordType.EXPENSE, category: 'Rent', date: new Date('2024-03-05'), createdById: admin.id },
    { amount: 55, type: RecordType.EXPENSE, category: 'Transport', date: new Date('2024-03-07'), createdById: admin.id },
    { amount: 150, type: RecordType.INCOME, category: 'Freelance', date: new Date('2024-03-10'), createdById: admin.id },
    { amount: 310, type: RecordType.EXPENSE, category: 'Utilities', date: new Date('2024-03-12'), createdById: admin.id },
  ];

  for (const record of records) {
    await prisma.financialRecord.create({
      data: record,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
