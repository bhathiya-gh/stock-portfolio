// Australian Stock Portfolio Dashboard JavaScript

// Company metadata with names and categories
const companyMeta = {
    'AGL.AX': { name: 'AGL Energy', category: 'Energy' },
    'ANZ.AX': { name: 'ANZ Banking Group', category: 'Finance' },
    'BHP.AX': { name: 'BHP Group', category: 'Mining' },
    'CBA.AX': { name: 'Commonwealth Bank', category: 'Finance' },
    'FMG.AX': { name: 'Fortescue Metals Group', category: 'Mining' },
    'NAB.AX': { name: 'National Australia Bank', category: 'Finance' },
    'ORG.AX': { name: 'Origin Energy', category: 'Energy' },
    'RIO.AX': { name: 'Rio Tinto', category: 'Mining' },
    'WBC.AX': { name: 'Westpac Banking Corp', category: 'Finance' }
};

let portfolioStats = {};

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStatsAndRenderDashboard();
    setupFeatureCardListeners(); // Add this line
});

// Setup event listeners for feature cards
function setupFeatureCardListeners() {
    console.log('Setting up feature card listeners');
    
    // Get all feature items
    const featureItems = document.querySelectorAll('.feature-item.clickable');
    console.log('Found feature items:', featureItems.length);
    
    featureItems.forEach((item, index) => {
        const action = item.getAttribute('data-action');
        console.log(`Setting up listener for card ${index} with action: ${action}`);
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Feature card clicked:', action);
            
            switch(action) {
                case 'trends': // View Stock Trends
                    scrollToSection('combined-trends');
                    break;
                case 'performance': // Market Performance
                    showMarketPerformance();
                    break;
                case 'companies': // Company Analysis
                    scrollToSection('companies');
                    break;
                case 'sectors': // Sector Overview
                    showSectorAnalysis();
                    break;
                default:
                    console.log('Unknown feature card action:', action);
            }
        });
        
        // Add visual feedback
        item.style.cursor = 'pointer';
        console.log(`Event listener added for card: ${action}`);
    });
    
    console.log('All feature card listeners setup complete');
}

async function loadStatsAndRenderDashboard() {
    try {
        console.log('Loading dashboard data...');
        
        // Load statistics from stats.json
        const response = await fetch('plots/stats.json');
        portfolioStats = await response.json();
        console.log('Portfolio stats loaded:', Object.keys(portfolioStats).length, 'companies');
        
        // Debug: Check what sections are visible
        const sections = document.querySelectorAll('section');
        console.log('Found sections on page:');
        sections.forEach((section, index) => {
            const title = section.querySelector('h2')?.textContent || 'No title';
            const isVisible = section.offsetParent !== null;
            console.log(`Section ${index}: "${title}" - Visible: ${isVisible}`);
        });
        
        // Render dashboard components (removed portfolio summary)
        renderCompanyTiles(portfolioStats);
        
        // Make main plot images clickable
        setupMainPlotExpansion();
        
        console.log('Dashboard rendering complete');
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load dashboard data');
    }
}

function setupMainPlotExpansion() {
    // Make main dashboard plots clickable for full-screen viewing
    const plotImages = [
        { id: 'stock-trends-plot', title: 'Stock Price Trends - Major Australian Companies' },
        { id: 'stock-trends-ma-plot', title: 'Stock Prices with Moving Average Overlay' },
        { id: 'fortnightly-ma-plot', title: 'Fortnightly Moving Average Trends' }
    ];
    
    plotImages.forEach(plot => {
        const img = document.getElementById(plot.id);
        if (img) {
            img.style.cursor = 'pointer';
            img.title = 'Click to view full size';
            img.onclick = () => expandImage(img.src, plot.title);
        }
    });
}

function renderCompanyTiles(stats) {
    const container = document.getElementById('company-tiles');
    container.innerHTML = '';
    
    Object.keys(stats).forEach(symbol => {
        const meta = companyMeta[symbol] || { name: symbol, category: 'Other' };
        const stat = stats[symbol];
        
        // Calculate performance indicators
        const latest = stat.latest;
        const mean = stat.mean;
        const performance = ((latest - mean) / mean * 100);
        const isPositive = performance > 0;
        
        const tile = document.createElement('div');
        tile.className = `company-tile ${meta.category.toLowerCase()}`;
        tile.onclick = () => openCompanyModal(symbol);
        
        tile.innerHTML = `
            <div class="category-badge ${meta.category.toLowerCase()}">${meta.category}</div>
            <div class="tile-header">
                <h3 class="company-name">${meta.name}</h3>
                <span class="company-symbol">${symbol}</span>
            </div>
            <div class="tile-stats">
                <div class="tile-stat">
                    <span class="tile-stat-label">Latest Price</span>
                    <span class="tile-stat-value">$${latest.toFixed(2)}</span>
                </div>
                <div class="tile-stat">
                    <span class="tile-stat-label">vs Average</span>
                    <span class="tile-stat-value price-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}${performance.toFixed(1)}%
                    </span>
                </div>
                <div class="tile-stat">
                    <span class="tile-stat-label">Range</span>
                    <span class="tile-stat-value">$${stat.min.toFixed(2)} - $${stat.max.toFixed(2)}</span>
                </div>
                <div class="tile-stat">
                    <span class="tile-stat-label">Volatility</span>
                    <span class="tile-stat-value">$${stat.sd.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        container.appendChild(tile);
    });
}

function openCompanyModal(symbol) {
    const meta = companyMeta[symbol] || { name: symbol, category: 'Other' };
    const stat = portfolioStats[symbol];
    
    if (!stat) return;
    
    // Calculate additional metrics
    const performance = ((stat.latest - stat.mean) / stat.mean * 100);
    const priceRange = stat.max - stat.min;
    const volatilityPercent = (stat.sd / stat.mean * 100);
    
    // Update modal content
    document.getElementById('modal-company-name').textContent = `${meta.name} (${symbol})`;
    const modalPlot = document.getElementById('modal-plot');
    modalPlot.src = `plots/${symbol}_trend.png`;
    modalPlot.alt = `${symbol} Stock Trend`;
    
    // Add click-to-expand functionality
    modalPlot.onclick = () => expandImage(modalPlot.src, `${meta.name} (${symbol}) - Detailed Chart`);
    modalPlot.style.cursor = 'pointer';
    modalPlot.title = 'Click to view full size';
    
    // Update statistics
    document.getElementById('modal-latest').textContent = `$${stat.latest.toFixed(2)}`;
    document.getElementById('modal-mean').textContent = `$${stat.mean.toFixed(2)}`;
    document.getElementById('modal-min').textContent = `$${stat.min.toFixed(2)}`;
    document.getElementById('modal-max').textContent = `$${stat.max.toFixed(2)}`;
    document.getElementById('modal-sd').textContent = `$${stat.sd.toFixed(2)} (${volatilityPercent.toFixed(1)}%)`;
    
    const performanceElement = document.getElementById('modal-performance');
    performanceElement.textContent = `${performance > 0 ? '+' : ''}${performance.toFixed(2)}%`;
    performanceElement.className = `stat-value ${performance > 0 ? 'positive' : 'negative'}`;
    
    // Show modal
    document.getElementById('company-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('company-modal').style.display = 'none';
}

function expandImage(imageSrc, title) {
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(5px);
        cursor: pointer;
    `;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        cursor: pointer;
        z-index: 2001;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    // Close button hover effect
    closeBtn.onmouseover = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 1)';
        closeBtn.style.transform = 'scale(1.1)';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.9)';
        closeBtn.style.transform = 'scale(1)';
    };
    
    // Create image container
    const container = document.createElement('div');
    container.style.cssText = `
        max-width: 95%;
        max-height: 95%;
        text-align: center;
        cursor: default;
    `;
    
    // Prevent container clicks from closing the overlay
    container.onclick = (e) => e.stopPropagation();
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = `
        color: white;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    `;
    
    // Create image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        cursor: default;
    `;
    
    // Create close instruction
    const instruction = document.createElement('p');
    instruction.textContent = 'Click outside image or × button to close';
    instruction.style.cssText = `
        color: #ccc;
        margin-top: 1rem;
        font-size: 0.9rem;
    `;
    
    // Close function
    const closeModal = () => {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', escapeHandler);
    };
    
    // Assemble elements
    container.appendChild(titleElement);
    container.appendChild(img);
    container.appendChild(instruction);
    overlay.appendChild(closeBtn);
    overlay.appendChild(container);
    
    // Add to page
    document.body.appendChild(overlay);
    
    // Close on overlay click (but not on container click)
    overlay.onclick = closeModal;
    
    // Close on close button click
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeModal();
    };
    
    // Close on Escape key
    const escapeHandler = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('company-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

function showError(message) {
    const container = document.getElementById('company-tiles');
    if (container) {
        container.innerHTML = `<div class="loading">${message}</div>`;
    }
}

// Plot switcher functionality
function showPlot(plotType) {
    // Hide all plots
    const plots = document.querySelectorAll('.plot-image');
    plots.forEach(plot => plot.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.plot-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected plot and activate button
    if (plotType === 'stock-trends') {
        document.getElementById('stock-trends-plot').classList.add('active');
        document.querySelector('[onclick="showPlot(\'stock-trends\')"]').classList.add('active');
    } else if (plotType === 'stock-trends-ma') {
        document.getElementById('stock-trends-ma-plot').classList.add('active');
        document.querySelector('[onclick="showPlot(\'stock-trends-ma\')"]').classList.add('active');
    } else if (plotType === 'fortnightly-ma') {
        document.getElementById('fortnightly-ma-plot').classList.add('active');
        document.querySelector('[onclick="showPlot(\'fortnightly-ma\')"]').classList.add('active');
    }
}

// Navigation and feature linking functions
function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId); // Debug log
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add a highlight effect
        section.style.transition = 'background-color 0.3s ease';
        section.style.backgroundColor = 'rgba(42, 82, 152, 0.05)';
        setTimeout(() => {
            section.style.backgroundColor = '';
        }, 2000);
    } else {
        console.error('Section not found:', sectionId);
    }
}

function showPortfolioSummary() {
    console.log('Showing portfolio summary'); // Debug log
    // Create a summary modal or alert with key portfolio stats
    if (Object.keys(portfolioStats).length > 0) {
        const companies = Object.keys(portfolioStats);
        const totalCompanies = companies.length;
        const avgPrice = companies.reduce((sum, symbol) => sum + portfolioStats[symbol].Latest, 0) / totalCompanies;
        
        const topPerformer = companies.reduce((top, current) => 
            portfolioStats[current].Latest > portfolioStats[top].Latest ? current : top
        );
        
        const summary = `📊 Portfolio Summary:
• Total Companies: ${totalCompanies}
• Average Stock Price: $${avgPrice.toFixed(2)}
• Top Performer: ${topPerformer} ($${portfolioStats[topPerformer].Latest})
• Data Last Updated: ${new Date().toLocaleDateString()}`;
        
        alert(summary);
    } else {
        alert('Portfolio data is loading. Please try again in a moment.');
    }
}

function togglePlotMode() {
    console.log('Toggling plot mode'); // Debug log
    // Cycle through different plot modes
    const activeButton = document.querySelector('.plot-btn.active');
    const allButtons = document.querySelectorAll('.plot-btn');
    
    if (allButtons.length === 0) {
        console.error('No plot buttons found');
        return;
    }
    
    let currentIndex = Array.from(allButtons).indexOf(activeButton);
    
    // Move to next plot mode
    currentIndex = (currentIndex + 1) % allButtons.length;
    allButtons[currentIndex].click();
    
    // Scroll to the plots section
    scrollToSection('combined-trends');
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.showPortfolioSummary = showPortfolioSummary;
window.togglePlotMode = togglePlotMode;
