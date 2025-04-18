# MoMo SMS Analytics Platform

## Overview

This project is designed to process and analyze SMS data from MoMo (Mobile Money) transactions in XML format. The system provides comprehensive tools to extract, clean, categorize, store, and visualize transaction data. The application is built using FastAPI for the backend and JavaScript for the frontend, featuring advanced filtering, interactive visualizations, and detailed transaction analysis capabilities.

Users can upload XML files containing SMS messages, process them automatically, and explore the data through an intuitive dashboard interface. The platform helps users gain valuable insights into their mobile payment transaction patterns and financial behaviors.

## Features

- **XML Data Processing**: Parse and extract transaction data from SMS messages in XML format
- **Intelligent Categorization**: Automatically categorize transactions into types (deposits, withdrawals, payments, etc.)
- **Interactive Dashboard**: Visualize transaction data with dynamic charts and graphs
- **Advanced Filtering**: Filter transactions by date, amount, type, and other parameters
- **Transaction Details**: View complete details of individual transactions
- **Data Export**: Export processed data in CSV or JSON formats
- **Responsive Design**: Access the dashboard on desktop or mobile devices

## Technology Stack

- **Backend**: Python, FastAPI, SQLite/PostgreSQL
- **Frontend**: JavaScript, HTML, CSS, Chart.js
- **Data Processing**: pandas, xml.etree.ElementTree
- **Authentication**: JWT-based authentication

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
\`\`\`bash
# Clone the repository
git clone https://github.com/oyinwenebif/momo-analytics.git
cd momo-analytics/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload
\`\`\`

### Frontend Setup
\`\`\`bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

## Project Structure

\`\`\`
momo-analytics/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── scripts/
│   │   └── sms_processor.py
│   └── main.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
└── README.md
\`\`\`

## Usage

1. Start the backend and frontend servers
2. Navigate to `http://localhost:3000` in your browser
3. Upload an XML file containing SMS messages
4. View the processed data in the dashboard
5. Use the filters to analyze specific transaction types or date ranges
6. Export the data as needed

## Screenshots

![Dashboard Overview](/screenshots/dashboard.png)
![Transaction Analysis](/screenshots/analysis.png)
![Data Upload](/screenshots/upload.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Oyinwenebi Fiderikumo
