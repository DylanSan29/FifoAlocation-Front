import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [allocations, setAllocations] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3001/api/allocate');
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.progress) {
                setProgress(data.progress);
            } else {
                setAllocations(data);
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Order Allocations</h1>
                {progress < 1 ? (
                    <p>Progress: {Math.round(progress * 100)}%</p>
                ) : (
                    <AllocationList allocations={allocations} />
                )}
            </header>
        </div>
    );
}

function AllocationList({ allocations }) {
    return (
        <ul className="allocation-list">
            {allocations.map(allocation => (
                <AllocationItem key={allocation.id} allocation={allocation} />
            ))}
        </ul>
    );
}

function AllocationItem({ allocation }) {
    return (
        <li className="allocation-item">
            <span><strong>Order ID:</strong> {allocation.id}</span>
            <span><strong>Expected Date:</strong> {allocation.expected}</span>
        </li>
    );
}

export default App;
