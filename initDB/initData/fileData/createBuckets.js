const { connectFileDB } = require('../../Config/DBConfig');

const buckets = [
    'charity-resources',
    'donor-resources',
    'project-resources',
];

const createBuckets = async () => {
    try {
        const db = await connectFileDB();
        
        for (const bucket of buckets) {
          console.log(`> Creating bucket: ${bucket}`);
          await db.createCollection(`${bucket}.chunks`);
          await db.createCollection(`${bucket}.files`);
        }
    } catch (error) {
        throw new Error('Error Create Buckets:' + error);
    }
}

module.exports = { createBuckets };