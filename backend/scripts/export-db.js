const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/question_paper_generator';
const seedsDir = path.join(__dirname, '../seeds');

async function exportDatabase() {
  console.log('---');
  console.log('## Exporting local database to seed files...');
  
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db();

    if (!fs.existsSync(seedsDir)) {
      fs.mkdirSync(seedsDir, { recursive: true });
    }

    // Get all collections except 'migrations'
    const collections = await db.listCollections().toArray();
    const targetCollections = collections
      .map(c => c.name)
      .filter(name => name !== 'migrations' && name !== 'system.indexes');

    if (targetCollections.length === 0) {
      console.log('No collections found to export.');
      return;
    }

    for (const collectionName of targetCollections) {
      console.log(`\nExporting collection: ${collectionName}`);
      const data = await db.collection(collectionName).find({}).toArray();

      if (data.length === 0) {
        console.log(`Skipping ${collectionName}: Collection is empty.`);
        continue;
      }

      // Remove MongoDB specific _id if you want clean seeds, or keep them
      // Most teams prefer removing _id for seeds to allow clean re-insertion
      const cleanData = data.map(doc => {
        const { _id, ...rest } = doc;
        return rest;
      });

      const fileName = `${collectionName}.seed.json`;
      const filePath = path.join(seedsDir, fileName);
      
      fs.writeFileSync(filePath, JSON.stringify(cleanData, null, 2));
      console.log(`Saved ${data.length} records to ${fileName}`);
    }

    console.log('\n---');
    console.log('## Export completed successfully');
    console.log(`Seed files are located in: ${seedsDir}`);
    console.log('You can now commit these files to share your data.\n');

  } catch (err) {
    console.error('Error during export:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

exportDatabase();
