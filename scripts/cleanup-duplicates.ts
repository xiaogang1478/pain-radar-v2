import prisma from '../lib/prisma';

async function cleanup() {
  // 找出所有重复的标题
  const duplicates = await prisma.painPoint.groupBy({
    by: ['title'],
    _count: { id: true },
    having: { id: { _count: { gt: 1 } } }
  });

  console.log(`找到 ${duplicates.length} 个重复标题`);

  for (const dup of duplicates) {
    // 找出所有重复记录
    const records = await prisma.painPoint.findMany({
      where: { title: dup.title },
      orderBy: { id: 'asc' },
      select: { id: true }
    });

    // 保留第一个，删除其余
    const toDelete = records.slice(1).map(r => r.id);
    console.log(`删除 ${toDelete.length} 条重复记录: ${dup.title.slice(0, 30)}...`);

    await prisma.painPoint.deleteMany({
      where: { id: { in: toDelete } }
    });
  }

  const count = await prisma.painPoint.count();
  console.log(`清理完成，剩余 ${count} 条记录`);
}

cleanup()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
