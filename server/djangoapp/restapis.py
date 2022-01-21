import requests
import json
# import related models here
from requests.auth import HTTPBasicAuth
from .models import CarDealer


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



# Create a `post_request` to make HTTP POST requests
# e.g., response = requests.post(url, params=kwargs, json=payload)

# Create a get_dealer_reviews_from_cf method to get reviews by dealer id from a cloud function
# def get_dealer_by_id_from_cf(url, dealerId):
# - Call get_request() with specified arguments
# - Parse JSON results into a DealerView object list


# Create an `analyze_review_sentiments` method to call Watson NLU and analyze text
# def analyze_review_sentiments(text):
# - Call get_request() with specified arguments
# - Get the returned sentiment label such as Positive or Negative



