/**
 * Get all dealerships
 */

const Cloudant = require("@cloudant/cloudant");

async function main(params) {
  const cloudant = Cloudant({
    url: "https://apikey-v2-184c0dmvy0v8vo4799mbcneylajckl4ao0eijnhp7op4:59a55164760e2d6de376e124dc43c0f5@9ca0d435-dbf3-4688-8c65-1a27b1a31ee6-bluemix.cloudantnosqldb.appdomain.cloud",
    plugins: {
      iamauth: { iamApiKey: "ruE6-pq2AVsBf4Vu5ZX0oeefdWhwDlw_oCV132KbdCeo" },
    },
  });
  try {
    let dbList = await cloudant.db.list();
    let dealerships = cloudant.db.use("dealerships");
    const response = await dealerships.list({ include_docs: true });
    const docs = response.rows.map((r) => {
      return r.doc;
    });
    console.log(docs);

    return { dbs: dbList };
  } catch (error) {
    return { error: error.description };
  }
}

function getDbs(cloudant, dbList) {
  cloudant.db
    .list()
    .then((body) => {
      body.forEach((db) => {
        dbList.push(db);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

main();
