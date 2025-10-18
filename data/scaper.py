import requests
import json

def fetch_ev_markers():
    """Fetch EV charging station markers from vialietuva.lt"""
    url = "https://ev.vialietuva.lt/async/fetch_markers"
    
    try:
        print(f"Fetching data from {url}...")
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad status codes
        
        data = response.json()
        
        # Save to JSON file
        output_file = "ev_markers.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Data successfully saved to {output_file}")
        print(f"Total records fetched: {len(data) if isinstance(data, list) else 'N/A'}")
        
        return data
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

def convert_to_geojson(input_file="ev_markers.json", output_file="ev_markers.geojson"):
    """Convert EV markers JSON to GeoJSON format"""
    try:
        # Read the input JSON file
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Create GeoJSON structure
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        
        # Convert each station to a GeoJSON feature
        stations = data.get("stations", {})
        for station_id, station in stations.items():
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [station["Lon"], station["Lat"]]  # GeoJSON uses [longitude, latitude]
                },
                "properties": {
                    "StationId": station["StationId"],
                    "Status": station["Status"],
                    "status_name": station["status_name"],
                    "status_timestamp": station["status_timestamp"]
                }
            }
            geojson["features"].append(feature)
        
        # Save to GeoJSON file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, indent=2, ensure_ascii=False)
        
        print(f"GeoJSON successfully saved to {output_file}")
        print(f"Total features: {len(geojson['features'])}")
        
        return geojson
    
    except FileNotFoundError:
        print(f"Error: {input_file} not found")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None
    except Exception as e:
        print(f"Error converting to GeoJSON: {e}")
        return None

def filter_geojson_by_bbox(input_geojson="ev_markers.geojson", output_geojson="ev_markers_filtered.geojson",
                          min_lat=54.490148, max_lat=54.883089, min_lon=24.892593, max_lon=25.551067):
    """Filter GeoJSON features to those within the bounding box and save to a new file."""
    try:
        with open(input_geojson, 'r', encoding='utf-8') as f:
            geojson = json.load(f)

        filtered_features = []
        for feature in geojson.get("features", []):
            lon, lat = feature["geometry"]["coordinates"]
            if min_lat <= lat <= max_lat and min_lon <= lon <= max_lon:
                filtered_features.append(feature)

        filtered_geojson = {
            "type": "FeatureCollection",
            "features": filtered_features
        }

        with open(output_geojson, 'w', encoding='utf-8') as f:
            json.dump(filtered_geojson, f, indent=2, ensure_ascii=False)

        print(f"Filtered GeoJSON saved to {output_geojson}")
        print(f"Total filtered features: {len(filtered_features)}")
        return filtered_geojson
    except Exception as e:
        print(f"Error filtering GeoJSON: {e}")
        return None

if __name__ == "__main__":
    # Fetch data first (optional, comment out if you already have the data)
    # fetch_ev_markers()
    
    # Convert to GeoJSON
    convert_to_geojson()
    filter_geojson_by_bbox()
