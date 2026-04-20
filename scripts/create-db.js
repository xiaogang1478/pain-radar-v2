const { Client } = require('pg');

async function createDatabase() {
  // 先连接到默认的postgres数据库
  const client = new Client({
    host: 'pgm-j6c99kn9x816j3k2qo.pg.rds.aliyuncs.com',
    port: 5432,
    user: 'petapp',
    password: 'PetApp2024!',
    database: 'postgres', // 连接到默认数据库
  });

  try {
    await client.connect();
    console.log('✅ 连接成功');

    // 检查数据库是否存在
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'pain_radar'"
    );

    if (result.rows.length === 0) {
      // 创建数据库
      await client.query('CREATE DATABASE pain_radar');
      console.log('✅ 数据库 pain_radar 创建成功');
    } else {
      console.log('ℹ️ 数据库 pain_radar 已存在');
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
