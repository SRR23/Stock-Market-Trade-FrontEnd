
# Stock-Market-Trade FrontEnd

This is a Front-End page for a trade platform built with React. The project allows users to create, read, update, and delete trade data, also see data visualization.


## Features

- CRUD operations for trade data
- Also you can see json data from stock_market_data.json
- User can see data visualization with LineChart and BarChart
- Also user can filter data by trade_code

## What I Learned

1. React fundamentals, including functional components and hooks.
2. How to visualize data using Recharts.
3. How to use Ant Design.
4. Implementing CRUD operations in a React-frontend with SQL backend.
5. State management and API handling.

## Challenges Faced

1. Understanding React’s `useState` and `useEffect` properly.
2. Making the table editable while syncing changes with the backend.
3. Integrating multi-axis charts dynamically.
4. Switching from JSON to SQL while keeping both models separate.

## Installation

Follow these steps to set up and run the project locally:


    1. Clone the Repository

    First, clone the repository from GitHub:

    git clone https://github.com/SRR23/Stock-Market-Trade-FrontEnd.git

    2. Install Dependencies
    Install the required packages:

    npm install

    3. Run the Development Server
    Start the React development server:

    npm run dev

    The Project will be available at:
    📌 http://localhost:5173/

## To switch Sql model

    In the src/api.js file, update the BASE_URL to switch to the SQL model by replacing it with the following URL:
     https://shaidur.pythonanywhere.com/api/trades/
    
## To switch JSON model

    In the src/api.js file, update the BASE_URL to switch to the JSON model by replacing it with the following URL:
     https://shaidur.pythonanywhere.com/api/json-data/

    note: Remember it's a static data, you don't make CRUD operations.

## Technologies Used

    React
    Bootstrap
    Recharts
    Ant Design
