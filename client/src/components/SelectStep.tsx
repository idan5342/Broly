import React from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';

interface SelectStepProps {
    step: number;
    setStep: (step: number) => void;
}

export const SelectStep: React.FC<SelectStepProps> = ({ step, setStep}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setStep(value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center',width: 200 }}>
      <TextField
        type="number"
        label="Step Size"
        value={step}
        onChange={handleChange}
        variant="outlined"
        slotProps={{ htmlInput: { min: 1, max: 60 }, input: {
            endAdornment: <InputAdornment position="end">sec</InputAdornment>
        } }}
      />
    </Box>
  );
};