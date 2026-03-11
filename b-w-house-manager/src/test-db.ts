import pool from './config/database';

async function testConnection() {
    console.log('Testing database connection...');
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection successful!');
        console.log('Current database time:', res.rows[0].now);
    } catch (err) {
        console.error('Database connection failed:');
        console.error(err);
        console.log('\nPlease check your .env file and ensure PostgreSQL is running.');
    } finally {
        await pool.end();
    }
}

testConnection();
