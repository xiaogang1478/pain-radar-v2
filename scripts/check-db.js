const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'postgresql://petapp:PetApp2024!@pgm-j6c99kn9x816j3k2qo.pg.rds.aliyuncs.com:5432/pain_radar';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const platformCount = await prisma.platform.count();
  const hotItemCount = await prisma.hotItem.count();
  
  console.log(`平台数: ${platformCount}`);
  console.log(`热点数: ${hotItemCount}`);
  
  if (hotItemCount > 0) {
    const sample = await prisma.hotItem.findFirst({
      include: { platform: true }
    });
    console.log('\n示例热点数据:');
    console.log(JSON.stringify(sample, null, 2));
  }
  
  await prisma.$disconnect();
}

check().catch(console.error);
