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

      // Get unique indexes for the collection to build a professional filter
      const indexes = await db.collection(collectionName).listIndexes().toArray();
      const uniqueIndexes = indexes.filter(idx => idx.unique && idx.name !== '_id_');

      for (const doc of data) {
        let filter = {};

        if (uniqueIndexes.length > 0) {
          // Use the fields from the first unique index found
          const firstUniqueIndex = uniqueIndexes[0];
          for (const key in firstUniqueIndex.key) {
            if (doc[key] !== undefined) {
              filter[key] = doc[key];
            }
          }
        }

        // If no unique index was found or the filter is still empty, fall back to logical defaults
        if (Object.keys(filter).length === 0) {
          if (doc.email) filter = { email: doc.email };
          else if (doc.text) filter = { text: doc.text };
          else if (doc.code) filter = { code: doc.code };
          else {
            // Ultimate fallback: check against a few common stable fields or the whole doc (minus volatile ones)
            const { createdAt, updatedAt, __v, ...stableData } = doc;
            filter = stableData;
          }
        }
        
        try {
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
        } catch (err) {
          console.error(`Error processing document in ${collectionName}:`, err.message);
          // If updateOne fails due to index collision (e.g. filter didn't catch it), count as duplicate
          if (err.code === 11000) duplicateCount++;
          else throw err;
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
