import requests
import pandas as pd

url = "https://www.geoportal.lt/mapproxy/ESO_DB_Public/MapServer/1/query"
params = {
    "where": "1=1",
    "outFields": "*",
    "f": "geojson"
}

r = requests.get(url, params=params)
data = r.json()

# Convert to DataFrame
df = pd.json_normalize(data["features"])
print(df.head())
