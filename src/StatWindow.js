import React, { useContext, memo } from "react";
//Contexts
import { ThemeContext } from "./contexts/ThemeContext";
import { UserDataContext } from "./contexts/UserDataContext";
//Helpers
import { dateFormat, colorSet } from "./config";
//MUI elements
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
//Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
//ChartJS elements
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
//Style
import "./StatWindow.css";

const ChartComponent = function (props) {
  const { type, data, options } = props;
  switch (type) {
    case "Bar":
      return <Bar data={data} options={options} />;
    case "Pie":
      return <Pie data={data} options={options} />;
    case "Line":
      return <Line data={data} options={options} />;
  }
};

function StatWindow(props) {
  const { openEditPopup, openDeletePopup, data } = props;
  const { isLightTheme, lightTheme, darkTheme } = useContext(ThemeContext);
  const { userEntries } = useContext(UserDataContext);

  //Window controls
  const editWindow = () => openEditPopup(null, true, data.id);
  const deleteWindow = () => openDeletePopup(data.id);

  //Filter entries by date only to shorten further processes
  console.log(data.name, data);
  const dateFilteredEntries = userEntries.filter(
    (ent) =>
      ent.date >= data.dateRange[0].seconds * 1000 &&
      ent.date <= data.dateRange[1].seconds * 1000 &&
      ent.sum !== 0
  );
  //1. Create an array of arrays of entries
  //Filter eligible entries for display
  const eligibleEntries = new Object(); //Создаём пустой объект, который будем мэпить
  ["Group", "Item", "Source"].map(function (dbEl) {
    // Мэпим по типам элементов БД
    data[`display${dbEl}s`].map(function (displayDbEl) {
      //Мэпим по требуемым настройками элементам
      const filteredByDisplayElement = new Array();
      dateFilteredEntries.map((ent) => {
        //Мэпим по отфильтрованным записям
        if (ent[dbEl.toLowerCase()] === displayDbEl) {
          //Если элемент записи соответствует настройкам
          filteredByDisplayElement.push(ent); //Кладём запись в массив
        }
      });
      if (filteredByDisplayElement.length > 0) {
        eligibleEntries[displayDbEl + " " + dbEl.toLowerCase()] =
          filteredByDisplayElement;
      }
    });
  });
  data.displayTags.map(function (displayTag) {
    const displayTagFiltered = new Array();
    dateFilteredEntries.map(function (entry) {
      entry.tags.map(function (tag) {
        if (tag === displayTag) {
          displayTagFiltered.push(entry);
        }
      });
    });
    if (displayTagFiltered.length > 0) {
      eligibleEntries[displayTag + " tag"] = displayTagFiltered;
    }
  });
  //Result: eligibleEntries = {group: Array(4), tags: Array(7)}
  //Create a data object for the chart
  const generateDataObject = function () {
    let dataObject = null;
    console.log("data.dateRange: ", data.dateRange);
    switch (data.chartType) {
      case "Bar":
      case "Line":
        const labelsArray = new Array();
        let loopingDate = new Date(data.dateRange[0].seconds * 1000);
        const endDate = new Date(
          (data.dateRange[1].seconds + 24 * 60 * 60) * 1000
        );
        while (
          new Intl.DateTimeFormat("en-IE", dateFormat).format(
            new Date(loopingDate)
          ) !==
          new Intl.DateTimeFormat("en-IE", dateFormat).format(new Date(endDate))
        ) {
          labelsArray.push(
            new Intl.DateTimeFormat("en-IE", dateFormat).format(
              new Date(loopingDate)
            )
          );
          loopingDate.setDate(loopingDate.getDate() + 1);
        }
        dataObject = {
          //labels: data.map((dt) => new Intl.DateTimeFormat("en-IE", dateFormat).format(new Date(dt.date))),
          //Create string date format for comparison
          //2. Merge them into one 3. Sort by date 4. Convert dates to string format 5. Convert the array to a map 6. Convert the map back into an array
          //datasets:
          //1. map through array of arrays of entries and create the following object for each:
          //{label: 'name of the BD element filtered', data: 'array of money sums summed by date'}
          labels: labelsArray,
          datasets: Object.keys(eligibleEntries).map(function (key, i) {
            return {
              label: key,
              data:
                //map through labelsArray
                //sameDate = false
                //map through eligibleEntries
                //
                labelsArray
                  .map((date) => {
                    let daySum = 0;
                    eligibleEntries[key].map((ent) => {
                      if (
                        new Intl.DateTimeFormat("en-IE", dateFormat).format(
                          new Date(ent.date)
                        ) === date
                      ) {
                        daySum += ent.sum;
                      }
                    });
                    return daySum;
                  })
                  .reverse(),
              backgroundColor: isLightTheme
                ? colorSet[i >= colorSet.length ? colorSet.length - i : i].light
                : colorSet[i >= colorSet.length ? colorSet.length - i : i].dark,
              borderColor: isLightTheme
                ? colorSet[i >= colorSet.length ? colorSet.length - i : i].light
                : colorSet[i >= colorSet.length ? colorSet.length - i : i].dark,
              borderRadius: 16,
              tension: 0.4,
              pointRadius: 0,
              pointHitRadius: 10,
              pointHoverRadius: 0,
              pointHoverBorderWidth: 0,
            };
          }),
          //map through eligibleEntries object keys (group, tags)
          //label: 'key: elementName' [0]
          //data: 1. Create a new array of objects with only sums and converted date strings 2. Use a for loop to reduce sums by date
        };
        break;
      case "Pie":
        const totalValue = Object.keys(eligibleEntries)
          .map((key) =>
            eligibleEntries[key]
              .map((dt) => dt.sum)
              .reduce((prevVal, curVal) => prevVal + curVal, 0)
          )
          .reduce((prevVal, curVal) => prevVal + curVal, 0);
        dataObject = {
          labels: Object.keys(eligibleEntries).map(function (key) {
            const percent =
              (100 *
                eligibleEntries[key]
                  .map((dt) => dt.sum)
                  .reduce((prevVal, curVal) => prevVal + curVal)) /
              totalValue;
            return key + ` (${Math.round(percent * 100) / 100}%)`;
          }),
          datasets: [
            {
              label: "none",
              data: Object.keys(eligibleEntries).map((key) =>
                eligibleEntries[key]
                  .map((dt) => dt.sum)
                  .reduce((prevVal, curVal) => prevVal + curVal)
              ),
              backgroundColor: Object.keys(eligibleEntries).map((key, i) => {
                return isLightTheme
                  ? colorSet[i >= colorSet.length ? colorSet.length - i : i]
                      .light
                  : colorSet[i >= colorSet.length ? colorSet.length - i : i]
                      .dark;
              }),
              borderColor: Object.keys(eligibleEntries).map((key, i) => {
                return isLightTheme
                  ? colorSet[i >= colorSet.length ? colorSet.length - i : i]
                      .light
                  : colorSet[i >= colorSet.length ? colorSet.length - i : i]
                      .dark;
              }),
            },
          ],
        };
    }
    return dataObject;
  };

  Chart.register(...registerables);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        m: "10px 0",
        textAlign: "center",
        width: "100%",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        alignItems="right"
        spacing={1}
        sx={{ position: "absolute", right: 20 }}
      >
        <IconButton size="small" onClick={editWindow}>
          <EditIcon color={isLightTheme ? "primary" : "info"} />
        </IconButton>
        <IconButton size="small" onClick={deleteWindow}>
          <DeleteIcon color={isLightTheme ? "primary" : "info"} />
        </IconButton>
      </Stack>
      <Typography variant={"h4"}>{data.name}</Typography>
      <div style={{ minHeight: "500px", maxHeight: "1000px" }}>
        <ChartComponent
          data={generateDataObject()}
          type={data.chartType}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                usePointStyle: true,
              },
              legend: {
                labels: {
                  color: isLightTheme
                    ? lightTheme.palette.text.primary
                    : darkTheme.palette.text.primary,
                },
              },
              title: {
                display: data.chartType === "Pie" ? true : false,
                text:
                  data.chartType === "Pie"
                    ? `${new Intl.DateTimeFormat("en-IE", dateFormat).format(
                        new Date(data.dateRange[0].seconds * 1000)
                      )} - ${new Intl.DateTimeFormat(
                        "en-IE",
                        dateFormat
                      ).format(new Date(data.dateRange[1].seconds * 1000))}`
                    : "",
                color: isLightTheme
                  ? lightTheme.palette.text.primary
                  : darkTheme.palette.text.primary,
              },
            },
            scales:
              data.chartType === "Pie"
                ? {
                    y: {
                      grid: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                      },
                      ticks: { display: false },
                    },
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                      },
                      ticks: { display: false },
                    },
                  }
                : {
                    y: {
                      grid: {
                        color: isLightTheme
                          ? lightTheme.palette.text.primary
                          : darkTheme.palette.text.primary,
                        drawBorder: false,
                      },
                      ticks: {
                        color: isLightTheme
                          ? lightTheme.palette.text.primary
                          : darkTheme.palette.text.primary,
                      },
                    },
                    x: {
                      grid: {
                        color: isLightTheme
                          ? lightTheme.palette.text.primary
                          : darkTheme.palette.text.primary,
                        drawBorder: false,
                      },
                      ticks: {
                        color: isLightTheme
                          ? lightTheme.palette.text.primary
                          : darkTheme.palette.text.primary,
                      },
                    },
                  },
          }}
        />
      </div>
    </Paper>
  );
}

export default memo(StatWindow);
