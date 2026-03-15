const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/question_paper_generator';
const dbName = MONGO_URI.split('/').pop().split('?')[0];
const migrationsDir = path.join(__dirname, '../migrations');

async function runMigrations() {
  console.log('---');
  console.log('Connecting to MongoDB...');
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('MongoDB Connected');
    console.log('-----------------');

    const db = client.db();
    const migrationsCollection = db.collection('migrations');

    console.log('Checking migrations...');

    // Ensure migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    console.log(`\nFound ${files.length} migration files`);

    const appliedMigrations = await migrationsCollection.find({}).toArray();
    const appliedFilenames = appliedMigrations.map(m => m.filename);
    
    console.log(`${appliedFilenames.length} already applied`);

    const pendingFiles = files.filter(f => !appliedFilenames.includes(f));
    console.log(`${pendingFiles.length} pending migration${pendingFiles.length === 1 ? '' : 's'}`);

    if (pendingFiles.length === 0) {
      console.log('\nNo new migrations found');
      console.log('-----------------');
      console.log('## Database schema is up to date\n');
      return;
    }

    for (const file of pendingFiles) {
      console.log(`\nRunning migration: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      
      try {
        await migration.up(db);
        await migrationsCollection.insertOne({
          filename: file,
          appliedAt: new Date()
        });
        console.log('Migration completed successfully');
      } catch (err) {
        console.error(`Migration failed: ${file}`);
        console.error(err);
        process.exit(1);
      }
    }

    console.log('-----------------');
    console.log('## Database schema is up to date\n');

  } catch (err) {
    console.error('Error connecting to MongoDB:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runMigrations();
