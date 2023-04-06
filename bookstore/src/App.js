import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AddBook from './AddBook';

function App() {
    const API = 'https://bookstore-db7f6-default-rtdb.europe-west1.firebasedatabase.app/books/';
    const [books, setBooks] = useState([]);

    // NOTE! Use your own firebase db URL here
    const fetchItems = async () => {
        const rsp = await fetch(`${API}.json`);
        const data = await rsp.json();
        addKeys(data);
    }

    useEffect(() => {
        fetchItems();
    }, [])

    const addBook = (newBook) => {
        fetch(`${API}.json`,
            {
                method: 'POST',
                body: JSON.stringify(newBook)
            })
            .then(response => fetchItems())
            .catch(err => console.error(err))
    }

    const deleteBook = (id) => {
        fetch(`${API}${id}.json`,
            {
                method: 'DELETE',
            })
            .then(response => fetchItems())
            .catch(err => console.error(err))
    }

    const addKeys = (data) => {
        const keys = Object.keys(data);
        const valueKeys = Object.values(data).map((item, index) =>
            Object.defineProperty(item, 'id', { value: keys[index] }));
        setBooks(valueKeys);
    }


    const gridOptions = {
        columnDefs: [
            { field: 'author', sortable: true, filter: true, lockPosition: true },
            { field: 'isbn', sortable: true, filter: true, lockPosition: true },
            { field: 'price', sortable: true, filter: true, lockPosition: true },
            { field: 'title', sortable: true, filter: true, lockPosition: true },
            { field: 'year', sortable: true, filter: true, lockPosition: true },
            {
                field: 'id', width: 90, lockPosition: true, cellRenderer: params => {
                    return <IconButton onClick={() => deleteBook(params.value)}><DeleteIcon /></IconButton>
                }
            }
        ],
        animateRows: true,
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" style={{margin:'auto'}}>
                        Book store
                    </Typography>
                </Toolbar>
            </AppBar>
            <AddBook addBook={addBook} />

            <div className="ag-theme-material" style={{ height: 400, width: 600, margin: 'auto' }}>
                <AgGridReact rowData={books} gridOptions={gridOptions}></AgGridReact>
            </div>
        </div>
    );
}

export default App;