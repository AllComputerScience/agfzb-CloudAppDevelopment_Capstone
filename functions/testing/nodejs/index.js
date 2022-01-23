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

  post_review_for_dealership(
    reviews_db,
    "2012",
    "Mazda",
    "6",
    "01/01/2012",
    "A test review 2.",
    15,
    "positive"
  );

  console.log(await action_get_all_reviews(reviews_db));
  console.log("End of all reviews! **************** \n\n\n\n");
  console.log(await action_get_all_dealerships(dealerships_db));
  console.log("End of all dealerships! **************** \n\n\n\n");
  console.log(await action_get_all_dealerships_by_st(dealerships_db, "CA"));
  console.log("End of all dealerships by state! **************** \n\n\n\n");
  console.log(
    await action_get_reviews_for_a_dealership(reviews_db, parseInt("15"))
  );
  console.log("End of reviews for the dealership! **************** \n\n\n\n");

  /* Endpoints */
  // https://5c90c98b.us-south.apigw.appdomain.cloud/api/dealership/
  // https://5c90c98b.us-south.apigw.appdomain.cloud/api/dealership/state?st=CA
  // https://5c90c98b.us-south.apigw.appdomain.cloud/api/review/dealership?dealership=15
  // https://5c90c98b.us-south.apigw.appdomain.cloud/api/review?dealership=15&review=A test

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

async function action_get_all_dealerships_by_st(dealerships_db, st) {
  let all_dealerships = await get_database(dealerships_db);
  let result = {};
  all_dealerships.forEach((item) => {
    if (item.st === st) result[item.id] = item;
  });
  return { json_dealerships: JSON.stringify(result) };
}

async function action_get_reviews_for_a_dealership(reviews_db, dealership) {
  let all_reviews = await get_database(reviews_db);
  let result = {};
  let count = 0;
  all_reviews.forEach((item) => {
    if (item.dealership === dealership) {
      result[count] = item;
      count++;
    }
  });
  return { json_reviews: JSON.stringify(result) };
}

function post_review_for_dealership(
  reviews_db,
  car_yr,
  make,
  model,
  pDate,
  _review,
  _dealership,
  sentiment
) {
  var review = {
    id: 1114,
    name: "Placeholder",
    dealership: _dealership,
    review: _review,
    purchase: false,
    another: "field",
    purchase_date: pDate,
    car_make: make,
    car_model: model,
    car_year: car_yr,
    sentiment: sentiment,
  };

  action_friendly_string = JSON.stringify(review);
  json = JSON.parse(action_friendly_string);
  console.log(json);

  return new Promise((resolve, reject) => {
    resolve(reviews_db.insert(json, (error, body) => {})).catch((error) => {
      reject({ e: error });
    });
  });
}

main();
