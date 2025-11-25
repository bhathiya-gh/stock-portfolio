# Australian Stock Portfolio Dashboard

A professional web dashboard for tracking and analyzing major Australian stocks with automated daily data updates via GitHub Actions.

## **Features**

- 📊 **Interactive Dashboard**: Professional web interface with company tiles and detailed analytics
- 📈 **Multiple Chart Views**: Stock prices, moving averages, and combined visualizations
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔄 **Automated Updates**: Daily data refresh at midnight Australian Eastern Time via GitHub Actions
- 📋 **Company Analytics**: Detailed statistics and individual company trend analysis
- 🎨 **Modern UI**: Clean, professional styling with smooth animations

## **Companies Tracked**

### **Major Banks**
- Commonwealth Bank of Australia (CBA.AX)
- National Australia Bank (NAB.AX)
- Westpac Banking Corporation (WBC.AX)
- Australia and New Zealand Banking Group (ANZ.AX)

### **Mining Companies**
- BHP Group Limited (BHP.AX)
- Rio Tinto Limited (RIO.AX)
- Fortescue Metals Group (FMG.AX)

### **Energy Companies**
- Origin Energy Limited (ORG.AX)
- AGL Energy Limited (AGL.AX)

## **Setup Instructions**

### **Prerequisites**
- Python 3.9+
- Git
- GitHub account
- RapidAPI account with Yahoo Finance API access

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd Stock-portfolio
```

### **2. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **3. Configure API Credentials**
Create a `credentials.txt` file in the root directory:
```
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=yahoo-finance15.p.rapidapi.com
```

### **4. Setup GitHub Secrets**
For automated deployment, add these secrets to your GitHub repository:
- `RAPIDAPI_KEY`: Your RapidAPI key
- `RAPIDAPI_HOST`: yahoo-finance15.p.rapidapi.com

### **5. Run Locally**
```bash
# Generate initial data and plots
cd backend
python compare_trends.py

# Start the web server
cd ../frontend
python -m http.server 8000
```

Visit `http://localhost:8000` to view the dashboard.

## **GitHub Actions Automation**

The repository includes automated daily updates that:
- ✅ Run at midnight Australian Eastern Time (handles DST automatically)
- ✅ Fetch latest stock data from Yahoo Finance API
- ✅ Generate updated plots and statistics
- ✅ Commit and push changes to the repository
- ✅ Support manual triggering for testing

### **Workflow Features**
- **Timezone Intelligence**: Automatically handles Australian Eastern Time (AEST/AEDT) transitions
- **Smart Execution**: Only runs during the midnight window (23:45-00:15 AET)
- **Error Handling**: Robust error handling and logging
- **Manual Trigger**: Can be manually triggered for testing

## **Usage**

### **Updating Stock Data**
To get the latest stock data:
```bash
cd backend
python compare_trends.py
```
This will:
- Fetch current stock prices from Yahoo Finance
- Update the CSV data file
- Generate new plot images
- Create updated statistics

### **Dashboard Features**
- **Plot Switcher**: Toggle between different chart views
  - Stock Prices: Raw closing prices
  - Stock Prices with MA: Prices with 14-day moving averages
  - MA Only: Just the moving average trends
- **Company Tiles**: Click any company for detailed analysis
- **Responsive Layout**: Automatically adapts to your screen size

## **Project Structure**
```
Stock-portfolio/
├── .github/workflows/
│   └── daily-stock-update.yml    # GitHub Actions workflow
├── backend/
│   ├── fetch.py                  # Data fetching from Yahoo Finance
│   └── compare_trends.py         # Data processing and plot generation
├── frontend/
│   ├── index.html               # Main dashboard interface
│   ├── styles.css               # Professional styling
│   ├── main.js                  # Interactive functionality
│   └── plots/                   # Generated charts and data
│       ├── stock_trends.png     # Main stock price chart
│       ├── fortnightly_moving_average.png  # MA chart
│       ├── stock_trends_with_ma.png        # Combined chart
│       ├── [SYMBOL]_trend.png   # Individual company charts
│       └── stats.json           # Company statistics
├── Data/
│   └── output_all_companies.csv # Historical stock data
├── credentials.txt              # API credentials (git-ignored)
├── requirements.txt             # Python dependencies
├── .gitignore                   # Git ignore rules
└── README.md
```

## **Technical Stack**

### **Backend**
- **Python**: Data processing and API integration
- **pandas**: Data manipulation and analysis
- **matplotlib**: Chart generation
- **requests**: API communication

### **Frontend**
- **HTML5**: Modern semantic markup
- **CSS3**: Professional responsive design
- **JavaScript**: Interactive functionality
- **HTTP Server**: Local development server

### **Automation**
- **GitHub Actions**: Automated daily updates
- **pytz**: Timezone handling
- **cron**: Scheduled execution

## **Deployment**

### **GitHub Pages (Static)**
The dashboard can be deployed to GitHub Pages for free hosting:
1. Enable GitHub Pages in repository settings
2. Set source to main branch `/frontend` folder
3. Access via `https://yourusername.github.io/Stock-portfolio`

### **Local Development**
For local development and testing:
```bash
cd frontend
python -m http.server 8000
```

## **Data Analysis Features**

The dashboard provides comprehensive analytics including:
- **Price Trends**: Historical closing prices for all tracked stocks
- **Moving Averages**: 14-day fortnightly moving averages for trend analysis
- **Statistical Metrics**: Latest price, mean, min, max, standard deviation for each stock
- **Individual Analysis**: Detailed charts for each company with both actual prices and moving averages
- **Comparative Views**: Side-by-side comparison of all stocks

## **Customization**

### **Adding New Stocks**
To track additional stocks, edit the `symbols` list in `backend/compare_trends.py`:
```python
symbols = [
    "CBA.AX",  # Add your new stock symbols here
    "YOUR.AX", # Make sure to use .AX for ASX stocks
    # ... existing symbols
]
```

### **Changing Update Frequency**
The system fetches data each time you run `compare_trends.py`. For regular updates, you can:
- Run manually when needed
- Set up a scheduled task on your system
- Create a simple script to automate the process

### **Styling Customization**
- Edit `frontend/styles.css` to change colors, fonts, or layout
- Modify `frontend/index.html` for structural changes
- Update `frontend/main.js` for functional modifications

## **API Information**

This project uses the Yahoo Finance API via RapidAPI:
- **Service**: Yahoo Finance15 API
- **Endpoint**: Stock quotes and historical data
- **Rate Limits**: Check your RapidAPI subscription for limits
- **Cost**: Free tier available, paid plans for higher usage

## **Troubleshooting**

### **Common Issues**
1. **API Key Errors**: Ensure your `credentials.txt` file is properly formatted
2. **Missing Plots**: Run `compare_trends.py` to generate initial data
3. **Server Issues**: Make sure you're in the `frontend` directory when starting the server
4. **Data Not Loading**: Check that `plots/stats.json` exists and is valid

### **Performance Tips**
- The dashboard loads faster after the first data generation
- Large datasets may take longer to process
- Consider running updates during off-peak hours for better API response

## **Contributing**

Contributions are welcome! Areas for improvement:
- 🐛 Bug fixes
- ✨ New chart types or analysis features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 📊 Additional stock exchanges or markets

## **License**

This project is open-source and available under the **MIT License**.

---

**Built with ❤️ for Australian stock market enthusiasts**

