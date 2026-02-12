import React from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';

interface SelectDistanceProps {
    distance: number;
    setDistance: (distance: number) => void;
}

export const SelectDistance: React.FC<SelectDistanceProps> = ({ distance, setDistance}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setDistance(value);
  };

  return (
      <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
      <TextField
        type="number"
        label="Distance"
        value={distance}
        onChange={handleChange}
        variant="outlined"
        slotProps={{ htmlInput: { min: 10 }, input: {
            endAdornment: <InputAdornment position="end">km</InputAdornment>
        } }}
      />
    </Box>
  );
};