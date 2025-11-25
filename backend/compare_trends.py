import os
import pandas as pd
import matplotlib.pyplot as plt
import subprocess

# Run fetch.py first to ensure data is up to date
fetch_script = os.path.abspath(os.path.join(os.path.dirname(__file__), 'fetch.py'))
subprocess.run(['python', fetch_script], check=True)
import os

# Data directory (relative to this script)
data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../Data"))
csv_path = os.path.join(data_dir, "output_all_companies.csv")

# Only plot the current companies in fetch.py
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

df = pd.read_csv(csv_path, parse_dates=["date"] if "date" in pd.read_csv(csv_path, nrows=1).columns else None)

# If 'date' is not a column, it's the index
if "date" not in df.columns:
    df.index = pd.to_datetime(df.index)
    df_for_plot = df
else:
    df["date"] = pd.to_datetime(df["date"])
    df.set_index("date", inplace=True)
    df_for_plot = df


# Save combined plot
plt.figure(figsize=(14, 7))
for symbol in symbols:
    if symbol in df_for_plot.columns:
        plt.plot(df_for_plot.index, df_for_plot[symbol], label=symbol)
plt.title("Stock Price Trends: Major Australian Banks, Miners & Energy Companies")
plt.xlabel("Date")
plt.ylabel("Closing Price ($)")
plt.legend()
plt.grid(True)
plt.tight_layout()
plots_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../docs/plots'))
os.makedirs(plots_dir, exist_ok=True)
plot_path = os.path.join(plots_dir, 'stock_trends.png')
plt.savefig(plot_path)
plt.close()

# Save fortnightly moving average plot
plt.figure(figsize=(14, 7))
for symbol in symbols:
    if symbol in df_for_plot.columns:
        # Calculate 14-day moving average
        ma_14 = df_for_plot[symbol].rolling(window=14, min_periods=1).mean()
        plt.plot(df_for_plot.index, ma_14, label=f"{symbol} (14-day MA)", linewidth=2)
plt.title("Fortnightly Moving Average: Major Australian Banks, Miners & Energy Companies")
plt.xlabel("Date")
plt.ylabel("14-Day Moving Average Price ($)")
plt.legend()
plt.grid(True)
plt.tight_layout()
ma_plot_path = os.path.join(plots_dir, 'fortnightly_moving_average.png')
plt.savefig(ma_plot_path)
plt.close()

# Save combined plot with both actual prices and moving averages
plt.figure(figsize=(16, 8))
colors = plt.cm.tab10(range(len(symbols)))  # Get distinct colors for each stock
for i, symbol in enumerate(symbols):
    if symbol in df_for_plot.columns:
        color = colors[i]
        # Plot actual price with medium opacity
        plt.plot(df_for_plot.index, df_for_plot[symbol], alpha=0.6, linewidth=1.5, color=color, label=f"{symbol} (Actual)")
        # Plot moving average with bold line
        ma_14 = df_for_plot[symbol].rolling(window=14, min_periods=1).mean()
        plt.plot(df_for_plot.index, ma_14, linewidth=2.5, color=color, linestyle='--', label=f"{symbol} (14-day MA)")
plt.title("Stock Prices with Fortnightly Moving Average Overlay")
plt.xlabel("Date")
plt.ylabel("Price ($)")
plt.legend()
plt.grid(True)
plt.tight_layout()
combined_ma_plot_path = os.path.join(plots_dir, 'stock_trends_with_ma.png')
plt.savefig(combined_ma_plot_path)
plt.close()

# Function to save individual plots
def save_individual_plots(df, symbols, plots_dir):
    for symbol in symbols:
        if symbol in df.columns:
            plt.figure(figsize=(12, 6))
            
            # Plot actual price
            plt.plot(df.index, df[symbol], label=f"{symbol} (Actual)", alpha=0.7, linewidth=1.5)
            
            # Calculate and plot 14-day moving average
            ma_14 = df[symbol].rolling(window=14, min_periods=1).mean()
            plt.plot(df.index, ma_14, label=f"{symbol} (14-day MA)", linewidth=2, linestyle='--')
            
            plt.title(f"Stock Price Trend with Moving Average: {symbol}")
            plt.xlabel("Date")
            plt.ylabel("Closing Price ($)")
            plt.legend()
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            file_path = os.path.join(plots_dir, f"{symbol}_trend.png")
            plt.savefig(file_path, dpi=150, bbox_inches='tight')
            plt.close()


# Save individual plots for each symbol
save_individual_plots(df_for_plot, symbols, plots_dir)


# Generate key stats for each stock and save as JSON and HTML table
import json
stats = {}
for symbol in symbols:
    if symbol in df_for_plot.columns:
        col = df_for_plot[symbol].dropna()
        stats[symbol] = {
            "latest": float(col.iloc[-1]) if len(col) > 0 else None,
            "mean": float(col.mean()) if len(col) > 0 else None,
            "min": float(col.min()) if len(col) > 0 else None,
            "max": float(col.max()) if len(col) > 0 else None,
            "sd": float(col.std()) if len(col) > 0 else None
        }
stats_path = os.path.join(plots_dir, "stats.json")
with open(stats_path, "w") as f:
    json.dump(stats, f, indent=2)
