import "./App.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import SelectTLE from "./components/SelectTLE";
import { useEffect, useState } from "react";
import axios from "axios";
import { SelectStep } from "./components/SelectStep";
import { SelectDistance } from "./components/SelectDistance";

interface TLE {
  satellite: string;
  line1: string;
  line2: string;
}

function App() {
  const [approaches, setApproaches] = useState<any[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<TLE | null>(null);
  const [step, setStep] = useState<number>(10);
  const [distance, setDistance] = useState<number>(100); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getApproaches = async () => {
      try {
        if (selectedSatellite) {
          setIsLoading(true);
          const { data } = await axios.post(
            "http://localhost:5000/approaches/",
            {
              tle: selectedSatellite,
              step: step,
              distance: distance
            }
          );
          setApproaches(data);
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getApproaches();
  }, [selectedSatellite]);
  const columns = ["satellite", "time", "distance"];

  return (
    <>
    <Stack direction="row" spacing={2} alignItems="center" padding={2} width={500}>
      <SelectTLE setSelectedSatellite={setSelectedSatellite} />
      <SelectStep step={step} setStep={setStep} />
      <SelectDistance distance={distance} setDistance={setDistance} />
      </Stack>
      {selectedSatellite && (<Typography variant="h6" gutterBottom>
        Found {approaches?.length} approaches for: {selectedSatellite ? selectedSatellite.satellite : "None"}
      </Typography>)}
      {!isLoading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {approaches?.map((approach) => {
                return (
                  <TableRow key={`approach-${approach.id}`}>
                    <TableCell>{approach.tle2.satellite}</TableCell>
                    <TableCell>{approach.time}</TableCell>
                    <TableCell>{approach.distance}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}

export default App;
