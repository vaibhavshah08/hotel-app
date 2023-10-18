import React from 'react';
import '../components/Table.css';
import { Button } from 'antd';

function Table({ data, onDelete }) {
  if (!data || data.length === 0) {
    return <div>No Rooms Booked</div>;
  }

  const handleDelete = (index) => {
    onDelete(index); 
  };

  const columns = Object.keys(data[0]);

  return (
    <table className='custom-table'>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column}>{row[column]}</td>
            ))}
            <td>
              <Button onClick={() => handleDelete(index)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
