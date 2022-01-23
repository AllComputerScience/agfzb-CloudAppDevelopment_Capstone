import requests
import json
# import related models here
from requests.auth import HTTPBasicAuth
from .models import CarDealer, DealerReview


# Create a `get_request` to make HTTP GET requests
# e.g., response = requests.get(url, params=params, headers={'Content-Type': 'application/json'},
#                                     auth=HTTPBasicAuth('apikey', api_key))


def get_request(url, **kwargs):

    print(kwargs)
    print('GET from {} '.format(url))
    try:
        # call get
        response = requests.get(url, headers={'Content-Type': 'application/json'}, params=kwargs)
        status_code = response.status_code
        print("With status {}".format(status_code))
        json_data = json.loads(response.text)
        return json_data
    except:
        print("Network exception occurred")
        return "Data could not be collected"


def get_dealers_from_cf(url, **kwargs):

    results = []
    try:
        json_result = get_request(url)

        if json_result:
            dealers = json.loads(json_result['json_dealerships'])
        
            for key in dealers:
                dealer_obj = CarDealer(address=dealers[key]["address"], city=dealers[key]["city"], full_name=dealers[key]["full_name"],
                                        id=dealers[key]["id"], lat=dealers[key]["lat"], long=dealers[key]["long"],
                                        short_name=dealers[key]["short_name"],
                                        st=dealers[key]["st"], zip=dealers[key]["zip"])
                results.append(dealer_obj)
        return results
    except Exception as error:
        return error


def post_request(url, json_payload, **kwargs):
    print(json_payload["review"]["dealership_review"])
    result = requests.post(url, json_payload["review"])
    return result


# Create a get_dealer_reviews_from_cf method to get reviews by dealer id from a cloud function
# def get_dealer_by_id_from_cf(url, dealerId):
# - Call get_request() with specified arguments
# - Parse JSON results into a DealerView object list

def analyze_review_sentiments(review, api_key):
        # This function was supplied by the instructor and it only returns 404.
        url = 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/8cf7f25f-c3a7-46ea-8788-36a9d05b7ee3'
        params = dict()
        params["text"] = review
        params["version"] = '2022-01-21'
        # params["features"] = kwargs["features"]
        params["return_analyzed_text"] = False
        result = requests.get(url, auth=HTTPBasicAuth('apikey', api_key), headers={'Content-Type': 'application/json'})
        print(result.reason)
        return result


def get_dealer_reviews_from_cf(url, dealership_id, api_key="Init"):

    results = []
    try:
        json_result = get_request(url, dealership=dealership_id)

        if json_result:
            reviews = json.loads(json_result['json_reviews'])

            for key in reviews:
                reviews_obj = DealerReview(dealership=reviews[key]['dealership'], name=reviews[key]['name'], purchase=reviews[key]['purchase'],
                                            review=reviews[key]['review'], purchase_date=reviews[key]['purchase_date'],
                                            car_make=reviews[key]['car_make'], car_model=reviews[key]['car_model'], 
                                            car_year=reviews[key]['car_year'], sentiment=reviews[key]['sentiment'], id=reviews[key]['id'])
                results.append(reviews_obj)
        return results
    except Exception as error:
        return error


