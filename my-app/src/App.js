import "./App.css";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";

function App() {
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    
  },[]);

  return (
    <>
      {!isLoggedIn && <div>nije logovan</div>}
      {isLoggedIn && <div>logovan</div>}
      
      {/* <Button variant="contained" onClick={(e) => setNestoDrugo(++nestoDrugo)}>nesto</Button>
      <Typography>{nestoDrugo}</Typography> */}

    </>
  );
}

export default App;
