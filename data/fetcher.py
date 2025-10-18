import requests
import json

class GeoportalFetcher:
    """Fetch data from Lithuanian Geoportal ESO MapServer"""
    
    def __init__(self):
        self.base_url = "https://www.geoportal.lt/mapproxy/ESO_DB_Public/MapServer"
        self.session = requests.Session()
        # Set a reasonable user agent
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get_layers(self):
        """Get all available layers"""
        url = f"{self.base_url}/layers"
        params = {'f': 'json'}
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    def get_layer_info(self, layer_id):
        """Get detailed information about a specific layer"""
        url = f"{self.base_url}/{layer_id}"
        params = {'f': 'json'}
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    def query_layer(self, layer_id, where="1=1", return_geometry=True, out_fields="*"):
        """Query features from a specific layer"""
        url = f"{self.base_url}/{layer_id}/query"
        params = {
            'f': 'json',
            'where': where,
            'outFields': out_fields,
            'returnGeometry': 'true' if return_geometry else 'false',
            'outSR': '3346'  # Lithuanian coordinate system
        }
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    def export_map(self, bbox, size="800,600", format="png"):
        """Export a map image for a given bounding box"""
        url = f"{self.base_url}/export"
        params = {
            'f': 'image',
            'bbox': bbox,
            'size': size,
            'format': format,
            'transparent': 'true',
            'bboxSR': '3346',
            'imageSR': '3346'
        }
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.content

# Example usage
if __name__ == "__main__":
    fetcher = GeoportalFetcher()
    
    # Get all available layers
    print("Fetching layers...")
    try:
        layers = fetcher.get_layers()
        print(json.dumps(layers, indent=2, ensure_ascii=False))
        
        # If layers are available, query the first one
        if 'layers' in layers and len(layers['layers']) > 0:
            layer_id = layers['layers'][0]['id']
            print(f"\nQuerying layer {layer_id}...")
            features = fetcher.query_layer(layer_id)
            print(f"Found {len(features.get('features', []))} features")
            
            # Save to file
            with open(f'layer_{layer_id}_data.json', 'w', encoding='utf-8') as f:
                json.dump(features, f, indent=2, ensure_ascii=False)
            print(f"Data saved to layer_{layer_id}_data.json")
            
    except Exception as e:
        print(f"Error: {e}")
        print("\nNote: You may need permission to access this service.")
        print("Contact: info@gis-centras.lt for authorized access")