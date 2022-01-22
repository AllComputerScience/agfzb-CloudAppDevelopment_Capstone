from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
# from .models import related models
# from .restapis import related methods
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from datetime import datetime
import logging
import json
from django.template import loader
from django.contrib.auth.forms import UserCreationForm
from .restapis import *

# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.


# Create an `about` view to render a static about page
def about_page(request):
    
    login_function(request)
    template = loader.get_template('djangoapp/about.html')
    context = {}
    return HttpResponse(template.render(context, request))


# Create a `contact` view to return a static contact page
def contact_page(request):
    
    login_function(request)
    context = {}
    return render(request, 'djangoapp/contact.html', context)


def login_request(request):
    
    login_function(request)
    template = loader.get_template('djangoapp/login.html')
    context = {}
    return HttpResponse(template.render(context, request))


def logout_request(request):

    if not login_function(request):
        logout(request)
    context = {}
    return render(request, 'djangoapp/logout_page.html', context)

def registration_page(request):
    
    login_function(request)
    template = loader.get_template('djangoapp/registration.html')
    saved = False

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            # If the form is valid, save the user fields
            form.save()
            saved = True
    else:
        form = UserCreationForm()

    context = { 'form' : form, 'saved' : saved }
    return HttpResponse(template.render(context, request))


# Update the `get_dealerships` view to render the index page with a list of dealerships
def get_dealerships(request):
    if request.method == "GET":
        url = "https://5c90c98b.us-south.apigw.appdomain.cloud/api/dealership/"
        # Get dealers from the URL
        dealerships = get_dealers_from_cf(url)
        # Concat all dealer's short name
        dealer_names = ' '.join([dealer.short_name for dealer in dealerships])
        # Return a list of dealer short name
        return HttpResponse(dealer_names)
    # login_function(request)
    # context = {}
    # return render(request, 'djangoapp/index.html', context)


# Create a `get_dealer_details` view to render the reviews of a dealer
# def get_dealer_details(request, dealer_id):
# ...

def get_dealer_details(request, dealership_id):
    if request.method == "GET":
        url = "https://5c90c98b.us-south.apigw.appdomain.cloud/api/review/dealership"
        reviews = get_dealer_reviews_from_cf(url, dealership_id, 'cATEkEA-WpY2rQadoGOcQaJoN-lcBzWVihPRXK8EOuN4')
        review_names = ' '.join([review.name for review in reviews])
        return HttpResponse(review_names)

# Create a `add_review` view to submit a review
# def add_review(request, dealer_id):
# ...

from django.contrib.auth.decorators import login_required

def add_review(request, dealership_id, _review):
    json_payload = dict()
    url = "https://5c90c98b.us-south.apigw.appdomain.cloud/api/review"
    review = dict()
    review["review"] = _review
    review["dealership"] = dealership_id
    json_payload["review"] = review
    print(json_payload)
    result = post_request(url, json_payload)
    return HttpResponse(result)


def login_function(request):

    # TODO
    # This should be handled somehow
    # It should also be tokenized
    # It should also be a separate module

    try:
        if request.method == 'POST':
            username = request.POST.get('Username')
            password = request.POST.get('Password')

            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                return True
            else:
                print('The user did not supply valid credentials, or did not request a log in - thus, they were not logged in.')
    except Exception as error:
        print('An error occurred during a log in attempt!')
        print(error)