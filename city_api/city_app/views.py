from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import requests
import csv
import json


def home(request):
    if request.method == "GET":
        action = request.GET.get('action')
        country = request.GET.get('country', '').strip()

        if action == "download" and country:
            api_url = 'https://countriesnow.space/api/v0.1/countries/cities'
            response = requests.post(api_url, json={'country': country})

            if response.status_code == 200:
                api_data = response.json()
                cities = api_data.get('data', [])

                csv_response = HttpResponse(content_type='text/csv')
                csv_response['Content-Disposition'] = 'attachment; filename="cities.csv"'

                writer = csv.writer(csv_response)
                writer.writerow(['City'])
                for city in cities:
                    writer.writerow([city])

                return csv_response
            else:
                return HttpResponse("Failed to fetch cities.", status=500)

        
        return render(request, 'home.html')

    elif request.method == "POST":
        data = json.loads(request.body)
        action = data.get("action")
        country = data.get('country', '').strip()
        api_url = 'https://countriesnow.space/api/v0.1/countries/cities'
        response = requests.post(api_url, json={'country': country})

        if response.status_code == 200:
            api_data = response.json()
            cities = api_data.get('data', [])

        if action == "get_city":
            return JsonResponse({'cities': cities})
        else:
            return JsonResponse({'cities': [], 'error': 'Invalid action'}, status=400)
