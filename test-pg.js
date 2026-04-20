const { Pool } = require('pg');

const pool = new Pool({
  host: 'pgm-j6c99kn9x816j3k2qo.pg.rds.aliyuncs.com',
  port: 5432,
  database: 'pain_radar',
  user: 'petapp',
  password: 'PetApp2024!',
});

async function test() {
  console.log('Connecting to PostgreSQL...');
  try {
    const result = await pool.query('SELECT 1 as test, current_database(), current_user, version()');
    console.log('SUCCESS!');
    console.log('Result:', JSON.stringify(result.rows, null, 2));
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    await pool.end();
    process.exit(1);
  }
}

test();
