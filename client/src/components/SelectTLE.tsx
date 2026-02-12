import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import axios from "axios";

interface TLE {
  satellite: string;
  line1: string;
  line2: string;
}

export default function SelectTLE({ setSelectedSatellite } : { setSelectedSatellite: (tle: TLE | null) => void }) {
  const [tles, setTles] = useState<TLE[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTLE, setSelectedTLE] = useState<TLE | null>(null);

  useEffect(() => {
    const fetchTLEs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/tles");
        setTles(response.data);
      } catch (error) {
        console.error("Failed to fetch TLEs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTLEs();
  }, []);

  return (
    <Autocomplete
    sx={{ width: 300 }}
      options={tles}
      getOptionLabel={(option) => `${option.satellite} (${option.line1.substring(2, 7)})`}
      value={selectedTLE}
      onChange={(event, newValue) => {
        setSelectedTLE(newValue);
        setSelectedSatellite(newValue);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select TLE"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
