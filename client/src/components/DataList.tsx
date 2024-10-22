import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// Initialize WebSocket connection
const socket = io('http://localhost:5000', {
  withCredentials: true, // Allow credentials (cookies, headers)
});

const DataList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();

    // Listen for real-time updates via Socket.IO
    socket.on('dataUpdated', (updatedData) => {
      setData((prevData) =>
        prevData.map((item) => (item._id === updatedData._id ? updatedData : item))
      );
    });

    return () => {
      socket.off('dataUpdated');
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data', {
        withCredentials: true  // Enable sending credentials
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGenerateData = async () => {
    try {
       await axios.post('http://localhost:5000/api/data/generate', {}, {
        withCredentials: true  // Enable sending credentials
      });
      fetchData();  // Refetch the data after generating new data
    } catch (error) {
      console.error('Error generating data:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateData}>Generate New Data</button>
      <table align='center' cellPadding={5} border={1}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Calculated Field</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.calculatedField || 'Processing...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataList;

