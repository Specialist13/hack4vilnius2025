import requests
import json
import time

addresses = [
    "Vydūno g. 2, Vilnius",
    "Žalgirio g. 92, Vilnius",
    "Ozo g. 25, Vilnius",
    "Ukmergės g. 221, Vilnius",
    "L. Asanavičiūtės g. 15, Vilnius",
    "Naugarduko g. 55a, Vilnius",
    "Vienuolio g. 4, Vilnius",
    "Konstitucijos pr. 7A, Vilnius",
    "P. Lukšio g. 34, Vilnius",
    "Antakalnio g. 37, Vilnius",
    "Ateities g. 31b, Vilnius",
    "Perkūnkiemio g. 4, Vilnius",
    "Kareivių g. 14, Vilnius",
    "Savanorių pr. 28, Vilnius",
    "Fabijoniškių g. 97a, Vilnius",
    "Verkių g. 31C, Vilnius",
    "Mindaugo g. 14b, Vilnius",
    "S. Stanevičiaus g. 23, Vilnius",
    "Dangeručio g. 1, Vilnius",
    "Ozo g. 18, Vilnius",
    "Savanorių pr. 1, Vilnius",
    "Pavilnionių g. 55, Vilnius",
    "Dariaus ir Girėnų g. 2, Vilnius",
    "Gedimino pr. 9, Vilnius",
    "Saltoniškių g. 9, Vilnius",
    "Kalvarijų g. 88, Vilnius",
    "Ukmergės g. 256, Vilnius",
    "Viršuliškių g. 40, Vilnius",
    "Priegliaus g. 1, Vilnius",
    "Vytauto Pociūno g. 8, Vilnius",
    "Žemaitės g. 22, Vilnius",
    "Žirmūnų g. 68A, Vilnius"
]

def geocode_address(address):
    """Geocode a single address using Nominatim API"""
    base_url = "https://nominatim.openstreetmap.org/search"
    
    params = {
        'q': address,
        'format': 'json',
        'limit': 1,
        'countrycodes': 'lt'
    }
    
    headers = {
        'User-Agent': 'VilniusAddressGeocodingScript/1.0'
    }
    
    try:
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()
        
        results = response.json()
        
        if results:
            return {
                'lat': float(results[0]['lat']),
                'lon': float(results[0]['lon']),
                'display_name': results[0]['display_name']
            }
        else:
            print(f"No results found for: {address}")
            return None
            
    except Exception as e:
        print(f"Error geocoding {address}: {e}")
        return None

def create_geojson(addresses):
    """Create GeoJSON from addresses"""
    features = []
    
    for i, address in enumerate(addresses, 1):
        print(f"Geocoding {i}/{len(addresses)}: {address}")
        
        result = geocode_address(address)
        
        if result:
            feature = {
                "type": "Feature",
                "properties": {
                    "address": address,
                    "display_name": result['display_name']
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [result['lon'], result['lat']]
                }
            }
            features.append(feature)
            print(f"  ✓ Found: {result['lat']:.6f}, {result['lon']:.6f}")
        else:
            print(f"  ✗ Failed to geocode")
        
        # Respect rate limit: 1 request per second
        if i < len(addresses):
            time.sleep(1.1)
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return geojson

# Run the geocoding
print("Starting geocoding process...")
print("This will take approximately 35 seconds due to rate limiting.\n")

geojson_data = create_geojson(addresses)

# Save to file
output_file = "vilnius_addresses.geojson"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(geojson_data, f, indent=2, ensure_ascii=False)

print(f"\n✓ GeoJSON saved to {output_file}")
print(f"Total addresses geocoded: {len(geojson_data['features'])}/{len(addresses)}")