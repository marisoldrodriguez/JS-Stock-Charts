async function main() {
  const timeChartCanvas = document.querySelector("#time-chart");
  const highestPriceChartCanvas = document.querySelector(
    "#highest-price-chart"
  );
  const averagePriceChartCanvas = document.querySelector(
    "#average-price-chart"
  );

  // Fetch request to TwelveData API
  const response = await fetch(
    "https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=e32efa75a4da45beb27397c9c33cf393"
  );
  const result = await response.json();
  console.log(result);

  const { GME, MSFT, DIS, BNTX } = result;

  const stocks = [GME, MSFT, DIS, BNTX];

  // use mockData in place of result when defining your stocks array when testing.
  // twelvedata only allows eight fetch requests per minute
  // const { GME, MSFT, DIS, BNTX } = mockData;

  // const stocks = [GME, MSFT, DIS, BNTX];

  stocks.forEach((stock) => stock.values.reverse());

  // Time Chart
  new Chart(timeChartCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: stocks[0].values.map((value) => value.datetime),
      datasets: stocks.map((stock) => ({
        label: stock.meta.symbol,
        data: stock.values.map((value) => parseFloat(value.high)),
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
      })),
    },
  });

  function getColor(stock) {
    if (stock === "GME") {
      return "rgba(61, 161, 61, 0.7)";
    }
    if (stock === "MSFT") {
      return "rgba(209, 4, 25, 0.7)";
    }
    if (stock === "DIS") {
      return "rgba(18, 4, 209, 0.7)";
    }
    if (stock === "BNTX") {
      return "rgba(166, 43, 158, 0.7)";
    }
  }

  // console.log(mockData)
  console.log(stocks);
  console.log(stocks[0].values);

  // Highest Stock Price Chart
  new Chart(highestPriceChartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: stocks.map((stock) => stock.meta.symbol),
      datasets: [
        {
          label: "Highest",
          data: stocks.map((stock) => findHighest(stock.values)),
          backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
        },
      ],
    },
  });

  function findHighest(values) {
    let highest = 0;
    values.forEach((value) => {
      if (parseFloat(value.high) > highest) {
        highest = value.high;
      }
    });
    return highest;
  }

  // Average Stock Price Chart
  new Chart(averagePriceChartCanvas.getContext("2d"), {
    type: "pie",
    data: {
      labels: stocks.map((stock) => stock.meta.symbol),
      datasets: [
        {
          label: "Average",
          data: stocks.map((stock) => findAverage(stock.values)),
          backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
        },
      ],
    },
  });

  function findAverage(values) {
    let total = 0;
    values.forEach((value) => {
      total = total + parseFloat(value.high);
    });
    return total / values.length;
  }
}

main();
