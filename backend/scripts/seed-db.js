const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/question_paper_generator';
const seedsDir = path.join(__dirname, '../seeds');

async function seedDatabase() {
  console.log('---');
  console.log('## Starting database seeding...');
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db();

    if (!fs.existsSync(seedsDir)) {
      console.log('No seeds directory found.');
      return;
    }

    const seedFiles = fs.readdirSync(seedsDir).filter(f => f.endsWith('.seed.json'));

    for (const file of seedFiles) {
      console.log(`\nLoading seed file: ${file}`);
      const collectionName = file.replace('.seed.json', '');
      const filePath = path.join(seedsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (!Array.isArray(data)) {
        console.log(`Skipping ${file}: Data must be an array.`);
        continue;
      }

      console.log(`Inserting ${collectionName}...`);
      
      let insertedCount = 0;
      let duplicateCount = 0;

      for (const doc of data) {
        // Simple check to avoid exact duplicates based on specific fields (e.g., 'text' for questions)
        // In a real app, you might use a unique field or _id
        const filter = doc.text ? { text: doc.text } : doc;
        
        const result = await db.collection(collectionName).updateOne(
          filter,
          { $setOnInsert: doc },
          { upsert: true }
        );

        if (result.upsertedCount > 0) {
          insertedCount++;
        } else {
          duplicateCount++;
        }
      }

      console.log(`${insertedCount} ${collectionName} inserted`);
      console.log(`${duplicateCount} duplicates skipped`);
    }

    console.log('\n---');
    console.log('## Seeding completed successfully\n');

  } catch (err) {
    console.error('Error during seeding:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
