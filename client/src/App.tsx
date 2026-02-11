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
} from "@mui/material";
import SelectTLE from "./components/SelectTLE";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [approaches, setApproaches] = useState([]);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getApproaches = async () => {
      try {
        if (selectedSatellite) {
          setIsLoading(true);
          const { data } = await axios.post(
            "http://localhost:5000/approaches/",
            {
              tle: selectedSatellite,
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
      <SelectTLE setSelectedSatellite={setSelectedSatellite} />
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
                  <TableRow key={approach.time}>
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
