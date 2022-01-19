/**
 * Get all dealerships
 */

const cloudant = require("@cloudant/cloudant");
const Cloudant = require("@cloudant/cloudant");

async function main(params) {
  const cloudant = Cloudant({
    url: "https://apikey-v2-184c0dmvy0v8vo4799mbcneylajckl4ao0eijnhp7op4:59a55164760e2d6de376e124dc43c0f5@9ca0d435-dbf3-4688-8c65-1a27b1a31ee6-bluemix.cloudantnosqldb.appdomain.cloud",
    plugins: {
      iamauth: { iamApiKey: "ruE6-pq2AVsBf4Vu5ZX0oeefdWhwDlw_oCV132KbdCeo" },
    },
  });

  let databases = await cloudant.db.list();
  let dealerships_db = cloudant.db.use("dealerships");

  console.log(await get_dealerships(dealerships_db));

  //   try {
  //     const response = await dealerships.list({ include_docs: true });
  //     const docs = response.rows.map((r) => {
  //       return r.doc;
  //     });
  //     console.log(docs);

  //     return { docs };
  //   } catch (error) {
  //     return { error: error.description };
  //   }
}

function get_dealerships(dealerships) {
  return new Promise((resolve, reject) => {
    dealerships
      .list({ include_docs: true })
      .then((response) => {
        resolve(
          response.rows.map((r) => {
            return r.doc;
          })
        );
      })
      .catch((error) => {
        reject({ e: error });
      });
  });
}

console.log(main());
