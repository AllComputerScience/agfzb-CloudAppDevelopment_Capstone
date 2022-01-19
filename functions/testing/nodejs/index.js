/**
 * This is not an IBM template. It was written by Eric Dee.
 */

const Cloudant = require("@cloudant/cloudant");

async function main(params) {
  const cloudant = Cloudant({
    url: "https://apikey-v2-184c0dmvy0v8vo4799mbcneylajckl4ao0eijnhp7op4:59a55164760e2d6de376e124dc43c0f5@9ca0d435-dbf3-4688-8c65-1a27b1a31ee6-bluemix.cloudantnosqldb.appdomain.cloud",
    plugins: {
      iamauth: { iamApiKey: "ruE6-pq2AVsBf4Vu5ZX0oeefdWhwDlw_oCV132KbdCeo" },
    },
  });

  let databases = cloudant.db.list();
  let dealerships_db = cloudant.db.use("dealerships");
  let reviews_db = cloudant.db.use("reviews");

  console.log(await get_dealerships(reviews_db));
  console.log(await get_dealerships_by_st(dealerships_db, "CA"));
  post_review_for_dealership(
    reviews_db,
    "They chased a rabbit and caught a whale. Now they are trapped forever.",
    15
  );
  console.log(await get_reviews_for_dealership(reviews_db, 15));

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

function get_dealerships(dealerships_db) {
  return new Promise((resolve, reject) => {
    dealerships_db
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

function get_dealerships_by_st(dealerships_db, st) {
  return new Promise((resolve, reject) => {
    dealerships_db
      .list({ include_docs: true })
      .then((response) => {
        resolve(
          response.rows.filter((r) => {
            if (r.doc.st === st) {
              return r.doc;
            }
          })
        );
      })
      .catch((error) => {
        reject({ e: error });
      });
  });
}

function get_reviews_for_dealership(reviews_db, dealership) {
  return new Promise((resolve, reject) => {
    reviews_db
      .list({ include_docs: true })
      .then((response) => {
        resolve(
          response.rows.filter((r) => {
            if (r.doc.review.dealership === dealership) {
              let item = r.doc;
              return item.doc;
            }
          })
        );
      })
      .catch((error) => {
        reject({ e: error });
      });
  });
}

function post_review_for_dealership(reviews_db, review, dealership) {
  var review = `{
    "review":
        {
            "id": 1114,
            "name": "Placeholder",
            "dealership": ${dealership},
            "review": "${review}",
            "purchase": false,
            "another": "field",
            "purchase_date": "02/16/2021",
            "car_make": "Audi",
            "car_model": "Car",
            "car_year": 2021
        }
    }`;

  json = JSON.parse(review);

  return new Promise((resolve, reject) => {
    resolve(reviews_db.insert(json, (error, body) => {})).catch((error) => {
      reject({ e: error });
    });
  });
}

main();
