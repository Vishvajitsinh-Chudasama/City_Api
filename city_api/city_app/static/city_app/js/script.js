function getCSRFToken() {
    let name = 'csrftoken';
    let cookieValue = null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
    return cookieValue;
}
document.getElementById('getBtn').addEventListener('click', async function () {
    const country = document.getElementById('countryInput').value;
    const statusText = document.getElementById('status');
    const cityList = document.getElementById('cityList');
    
    if (!country) {
    statusText.textContent = 'Please enter a country name.';
    return;
    }

    statusText.textContent = 'Fetching cities...';
    cityList.innerHTML = '';
    

    try {
        const response = await fetch("/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({action: 'get_city', country: country })
        });

        const data = await response.json();

        if (data.cities && data.cities.length > 0) {
            statusText.textContent = `Found ${data.cities.length} cities.`;
            data.cities.forEach(city => {
                const li = document.createElement('li');
                li.textContent = city;
                cityList.appendChild(li);
            });
        }
        else {
            statusText.textContent = 'No cities found.';
        }
    } catch (error) {
    console.error('Error fetching cities:', error);
    statusText.textContent = 'An error occurred.';
    }
});

document.getElementById('downloadBtn').addEventListener('click', function () {
    const country = document.getElementById('countryInput').value.trim();
    const statusText = document.getElementById('status');

    if (!country) {
        statusText.textContent = 'Please enter a country name.';
        return;
    }
    window.location.href = `/?action=download&country=${encodeURIComponent(country)}`;
});
