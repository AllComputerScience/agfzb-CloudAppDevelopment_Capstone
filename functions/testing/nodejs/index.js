/**
 * This is not an IBM template. It was written by Eric Dee.
 */

const Cloudant = require("@cloudant/cloudant");

async function main(params) {
  const cloudant = Cloudant({
    url: "https://apikey-v2-1hyf4mss3tk31el1a7g5h6o09i4inkg0ouxq807qx1ao:667051fcebc844c23862b4c073d5f3cf@816343f5-b793-4ce5-923b-45955dd61a3e-bluemix.cloudantnosqldb.appdomain.cloud",
    plugins: {
      iamauth: { iamApiKey: "r29o9cU8fj0NcNBilXS7phmT-B6W9AorI_b5U01qoczl" },
    },
  });

  let databases = cloudant.db.list();
  let dealerships_db = cloudant.db.use("dealerships");
  let reviews_db = cloudant.db.use("reviews");

  console.log(await action_get_all_reviews(reviews_db));
  console.log("End of all reviews! **************** \n\n\n\n");
  console.log(await action_get_all_dealerships(dealerships_db));
  console.log("End of all dealerships! **************** \n\n\n\n");

  // post_review_for_dealership(reviews_db, "A test review.", 15);

  // console.log(test2);
  // console.log(await get_dealerships_by_st(dealerships_db, "CA"));
  // console.log(await get_reviews_for_dealership(reviews_db, 15));

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

function get_database(database) {
  return new Promise((resolve, reject) => {
    database
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

async function action_get_all_reviews(reviews_db) {
  let all_reviews = await get_database(reviews_db);
  let result = {};
  all_reviews.forEach((item) => {
    result[item.review.id] = item.review;
  });
  return { json_reviews: JSON.stringify(result) };
}

async function action_get_all_dealerships(dealerships_db) {
  let all_dealerships = await get_database(dealerships_db);
  let result = {};
  all_dealerships.forEach((item) => {
    result[item.id] = item;
  });
  return { json_dealerships: JSON.stringify(result) };
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
  var review = `{ "review": {
    "id":1114,
    "name":"Placeholder",
    "dealership":${dealership},
    "review":"${review}",
    "purchase":false,
    "another":"field",
    "purchase_date":"02/16/2021",
    "car_make":"Audi",
    "car_model":"Car",
    "car_year":2021
  }}`;

  json = JSON.parse(review);
  console.log(json);

  return new Promise((resolve, reject) => {
    resolve(reviews_db.insert(json, (error, body) => {})).catch((error) => {
      reject({ e: error });
    });
  });
}

main();
