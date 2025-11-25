import requests
import json
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables from .env in backend folder
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

url = "https://yahoo-finance15.p.rapidapi.com/api/v2/markets/stock/history"

# List of major Australian banks and mining companies (ASX symbols)
symbols = [
    "CBA.AX",  # Commonwealth Bank
    "NAB.AX",  # National Australia Bank
    "WBC.AX",  # Westpac
    "ANZ.AX",  # ANZ Bank
    "BHP.AX",  # BHP Group
    "RIO.AX",  # Rio Tinto
    "FMG.AX",  # Fortescue Metals
    "ORG.AX",  # Origin Energy
    "AGL.AX"   # AGL Energy
]

headers = {
    "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
    "x-rapidapi-host": os.getenv("RAPIDAPI_HOST")
}

data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../Data"))
os.makedirs(data_dir, exist_ok=True)



# Collect all dataframes for concatenation
all_data = []

for symbol in symbols:
    print(f"Fetching data for {symbol}...")
    querystring = {"symbol": symbol, "interval": "1d"}
    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        data = response.json()
        # Save JSON (optional, can be removed if not needed)
        # json_path = os.path.join(data_dir, f"data_{symbol}.json")
        # with open(json_path, "w") as f:
        #     json.dump(data, f, indent=4)
        # print(f"Saved JSON to {json_path}")

        # Extract data for pivoting
        body = data.get("body", [])
        if body:
            df = pd.DataFrame({
                "date": pd.to_datetime([v["timestamp"] for v in body]),
                "closing_price$": [v["close"] for v in body],
                "symbol": symbol
            })
            all_data.append(df)
        else:
            print(f"Warning: No data in response body for {symbol}")
    else:
        print(f"Error: Unable to fetch data for {symbol}. Status code {response.status_code}")

# Save only the pivoted table (symbols as columns, dates as rows)
if all_data:
    combined_df = pd.concat(all_data, ignore_index=True)
    pivot_df = combined_df.pivot(index="date", columns="symbol", values="closing_price$")
    pivot_df = pivot_df.sort_index()
    combined_csv_path = os.path.join(data_dir, "output_all_companies.csv")
    pivot_df.to_csv(combined_csv_path)
    print(f"Saved pivoted table to {combined_csv_path}")




