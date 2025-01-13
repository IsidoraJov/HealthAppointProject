import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

const PrintableForm = () => {
  const componentRef = useRef();

  return (
    <div>
     
      <div ref={componentRef} style={{ padding: "20px", border: "1px solid black" }}>
        <h2>Patient Information</h2>
        <p>Name: John Doe</p>
        <p>Age: 30</p>
        <p>Diagnosis: Example Diagnosis</p>
 
      </div>

  
      <ReactToPrint
        trigger={() => <button>Print</button>}
        content={() => componentRef.current}
      />
    </div>
  );
};

export default PrintableForm;
