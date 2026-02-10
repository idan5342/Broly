import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

interface TLE {
    satellite: string;
    line1: string;
    line2: string;
}

export default function SelectTLE() {
    const [tles, setTles] = useState<TLE[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTLE, setSelectedTLE] = useState<TLE | null>(null);

    useEffect(() => {
        const fetchTLEs = async () => {
            setLoading(true);
            try {
            const response = await axios.get('http://localhost:5000/tles');
            setTles(response.data);
            } catch (error) {
            console.error('Failed to fetch TLEs:', error);
            } finally {
            setLoading(false);
            }
        };

        fetchTLEs();
    }, []);

    return (
        <Autocomplete
            options={tles}
            getOptionLabel={(option) => option.satellite}
            value={selectedTLE}
            onChange={(event, newValue) => setSelectedTLE(newValue)}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select TLE"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color="inherit" size={20} />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}