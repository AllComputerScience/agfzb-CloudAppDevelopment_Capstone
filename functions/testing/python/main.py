# The documentation for "Cloudant" is too sparse, and the examples were too involved.
# As a result, all of the database functions reside in nodejs/index.js instead.

from cloudant.client import Cloudant
from cloudant.error import CloudantException
import requests

def main(dict):
    databaseName = "dealerships"

    try:
        client = Cloudant.iam(
            api_key= "ruE6-pq2AVsBf4Vu5ZX0oeefdWhwDlw_oCV132KbdCeo",
            account_name= "9ca0d435-dbf3-4688-8c65-1a27b1a31ee6-bluemix",
            connect=True,
        )
        print("Databases: {0}".format(client.all_dbs()))
    except CloudantException as ce:
        print("unable to connect")
        return {"error": ce}
    except (requests.exceptions.RequestException, ConnectionResetError) as err:
        print("connection error")
        return {"error": err}

    return {"dbs": client.all_dbs()}

dictionary = {'COUCH_USERNAME':'', 'IAM_API_KEY':''}
main(dictionary)