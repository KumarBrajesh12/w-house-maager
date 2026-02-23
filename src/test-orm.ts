import "reflect-metadata";
import { AppDataSource } from './config/data-source';
import { User } from './entities/User';

async function testORM() {
    console.log('Testing TypeORM connection...');
    try {
        await AppDataSource.initialize();
        console.log('Database connection and schema synchronization successful!');

        const userRepository = AppDataSource.getRepository(User);
        const count = await userRepository.count();
        console.log(`Current user count: ${count}`);

        console.log('\nTo see these changes in your DB, run:');
        console.log(`psql -U ${process.env.DB_USER || 'postgres'} -d ${process.env.DB_NAME || 'task_db'} -c "\\dt"`);

    } catch (err) {
        console.error('TypeORM initialization failed:');
        console.error(err);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

testORM();
