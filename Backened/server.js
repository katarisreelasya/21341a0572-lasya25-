const express = require('express');
const cors = require('cors');  // Import CORS
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());  // Use CORS

const MAX_SIZE = 10;
let slidingWindow = [];

const ENDPOINTS = {
    'p': 'http://localhost:8090/primes',
    'f': 'http://localhost:8090/fibo',
    'e': 'http://localhost:8090/evens',
    'r': 'http://localhost:8090/rand',
};

function computeAverage(numbers) {
    if (!numbers.length) return 0.00;
    const total = numbers.reduce((acc, num) => acc + num, 0);
    return parseFloat((total / numbers.length).toFixed(2));
}

app.get('/data/:type_id', async (req, res) => {
    const typeId = req.params.type_id;

    if (!ENDPOINTS[typeId]) {
        return res.status(400).json({ error: "Invalid type ID. Use 'p', 'f', 'e', or 'r'." });
    }

    const previousState = [...slidingWindow];

    try {
        const response = await axios.get(ENDPOINTS[typeId], { timeout: 500 });
        const fetchedData = response.data.numbers;

        const newNumbers = fetchedData.filter(num => !slidingWindow.includes(num));

        for (const num of newNumbers) {
            if (slidingWindow.length >= MAX_SIZE) {
                slidingWindow.shift();
            }
            slidingWindow.push(num);
        }

        const currentState = [...slidingWindow];
        const average = computeAverage(slidingWindow);

        res.json({
            prevState: previousState,
            currState: currentState,
            numbers: fetchedData,
            avg: average
        });
    } catch (error) {
        res.json({
            prevState: previousState,
            currState: slidingWindow,
            numbers: [],
            avg: computeAverage(slidingWindow)
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
