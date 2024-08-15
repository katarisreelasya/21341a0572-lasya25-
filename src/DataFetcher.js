import React, { useState } from 'react';
import axios from 'axios';

function DataFetcher() {
    const [typeId, setTypeId] = useState('p');
    const [apiResponse, setApiResponse] = useState(null);

    const retrieveData = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/numbers/${typeId}`);
            setApiResponse(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <h1>Data Fetcher</h1>
            <label>
                Select type:
                <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                    <option value="p">Prime</option>
                    <option value="f">Fibonacci</option>
                    <option value="e">Even</option>
                    <option value="r">Random</option>
                </select>
            </label>
            <button onClick={retrieveData}>Fetch Data</button>

            {apiResponse && (
                <div>
                    <h2>Response</h2>
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default DataFetcher;
