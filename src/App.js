import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import "./App.css";
//import Button from "react-multi-date-picker/components/button"

function App() {
  const [selectedDate1, setSelectedDate1] = useState([""]);
  const [selectedDate2, setSelectedDate2] = useState([""]);
  const [monthYear, setMonthYear] = useState([""]);
  const [excludedDates, setExcludedDates] = useState([['']]);
  const [leadCount, setLeadCount] = useState([""]);
  const [tableData, setTableData] = useState([
    {
      id: 0,
      action: <input type="number" />,
      startDate: <DatePicker label="Start-date" />,
      endDate: <DatePicker label="End-date" />,
      excludedDates: <DatePicker multiple label="excludedDates" />,
      leadCount: <input type="number" />,
      lastUpdated: (
        <div>
          <button>Save</button>
          <br />
          <button>Cancel</button>
        </div>
      ),
    },
  ]);

  const addNewRow = () => {
    const newRow = {
      id: tableData.length ,
      action: <input type="text" />,
      startDate: <DatePicker label="StartDate" />,
      endDate: <DatePicker label="endDate" />,
      leadCount: <input type="number" />,
      lastUpdated: (
        <div>
          <button>Save</button>
          <br />
          <button>Cancel</button>
        </div>
      ),
    };
    setSelectedDate1((prev) => {
      const updatedPrev = [...prev];
      updatedPrev.push("");
      return updatedPrev
    });
    setSelectedDate2((prev) => {
      prev.push("");
      return prev;
    });
    setMonthYear((prev) => {
      prev.push("");
      return prev;
    });
    setExcludedDates((prev) => {
      const updatedPrev = [...prev];
      updatedPrev.push('');
      return updatedPrev
    });
    setLeadCount((prev) => {
      prev.push("");
      return prev;
    });
    setTableData([...tableData, newRow]);
  };

  function calculateNumberOfDays(startDate, endDate, excludedDates) {
    if (startDate && endDate) {
      const oneDay = 24 * 60 * 60 * 1000;
      let startTimestamp = startDate.getTime();
      let endTimestamp = endDate.getTime();
      let numExcludedDays = 0;
      if (Array.isArray(excludedDates) && excludedDates.length > 0 && excludedDates[0]) {
        for (let i = 0; i < excludedDates.length; i++) {
          if (excludedDates[i] instanceof Date) {
            const excludedDateTimestamp = excludedDates[i].getTime();
            if (
              excludedDateTimestamp >= startTimestamp &&
              excludedDateTimestamp <= endTimestamp
            ) {
              numExcludedDays += 1;
            };
          };
        };
      };
      const diffInTime = Math.abs(startTimestamp - endTimestamp);
      const diffInDays = Math.round(diffInTime / oneDay);
      const diffWithoutExcludedDates = diffInDays - numExcludedDays;
      return diffWithoutExcludedDates;
    } else {
      return "";
    };
  };
  
  function generateExpectedDRR(index) {
    if(!leadCount[index]) return "";
    const leadCountInt = parseInt(leadCount[index]);
    const numDays = calculateNumberOfDays(selectedDate1[index], selectedDate2[index], excludedDates[index]);
    const expectedLeadCount = Math.floor(leadCountInt/numDays);
    const ddr = expectedLeadCount * 100;
    return ddr;
  }

  return (
    <div>
      <button onClick={addNewRow}>Add New</button>
      <table id="table-elements">
        <thead>
          <tr>
            <th>Action</th>
            <th>Id</th>
            <th>StartDate</th>
            <th>EndDate</th>
            <th>Month, year</th>
            <th>Dates Excluded</th>
            <th>Number of Days</th>
            <th>Lead Count</th>
            <th>Expected DRR</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((rowData) => (
            <tr key={rowData.id}>
              <td>{rowData.action}</td>
              <td>{rowData.id}</td>
              <td>
                <DatePicker
                  value={selectedDate1[rowData.id]}
                  onChange={(newDate) => {
                    const dateObj = newDate.toDate();
                    setSelectedDate1((prevDates) => {
                      const updatedDates = [...prevDates];
                      updatedDates[rowData.id] = dateObj;
                      return updatedDates;
                    });
                  }}
                  renderInput={(items) => (
                    <input type="text" {...items} placeholder="Select Date" />
                  )}
                />
              </td>
              <td>
                <DatePicker
                  value={selectedDate2[rowData.id]}
                  onChange={(newDate) => {
                    const dateObj = newDate.toDate();
                    const monthYearString = `${dateObj.toLocaleString(
                      "default",
                      { month: "long" }
                    )}, ${dateObj.getFullYear()}`;
                    setMonthYear((prev) => {
                      const updatedMonthYear = [...prev];
                      updatedMonthYear[rowData.id] = monthYearString;
                      return updatedMonthYear;
                    });
                    setSelectedDate2((prevDates) => {
                      const updatedDates = [...prevDates];
                      updatedDates[rowData.id] = dateObj;
                      return updatedDates;
                    });
                  }}
                  renderInput={(items) => (
                    <input type="text" {...items} placeholder="Select Date" />
                  )}
                />
              </td>
              <td>{monthYear[rowData.id]}</td>
              <td>
                <DatePicker
                  multiple
                  value={excludedDates[rowData.id] || []}
                  onChange={(newDates) => {
                    setExcludedDates((prevDates) => {
                      const updatedDates = [...prevDates];
                      updatedDates[rowData.id] = newDates?.map((date) => {
                        return date.toDate();
                      });
                      return updatedDates;
                    });
                  }}
                />
              </td>
              <td>
                {calculateNumberOfDays(
                  selectedDate1[rowData.id],
                  selectedDate2[rowData.id],
                  excludedDates[rowData.id]
                )}
                d
              </td>
              <td><input type = "number" value = {leadCount[rowData.id]} onChange = {(e) => {
                e.preventDefault();
                setLeadCount((prev) => {
                  const updatedLeadCount = [...prev];
                  updatedLeadCount[rowData.id] = e.target.value;
                  return updatedLeadCount;
                });
              }} /></td>
              <td>{generateExpectedDRR(rowData.id)}</td>

              <td>{rowData.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;