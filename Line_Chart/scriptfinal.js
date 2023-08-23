// Set dimensions and margins for the chart
const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Set up the x and y scales
const x = d3.scaleTime()
  .range([0, width]);

const y = d3.scaleLinear()
  .range([height, 0]);

// Set up the line generator
const line = d3.line()
  .x(d => x(d.Date))
  .y(d => y(d.Close));

// Create the SVG element and append it to the chart container
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// create tooltip div

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");



// Load and process the data
d3.csv("BTC-USD_upd.csv").then(data => {
  // Parse the date and convert the population to a number
  //const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(d => {
    d.Date = new Date(d.Date);
    d.Close = +d.Close;
  });

  data.sort((a, b) => a.Date - b.Date);

  // Set the domains for the x and y scales
  x.domain(d3.extent(data, d => d.Date));
  y.domain([0, d3.max(data, d => d.Close)]);

  // Add the x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .style("font-size", "14px")
    .call(d3.axisBottom(x)
      .tickValues(x.ticks(d3.timeYear.every(1))) // Display ticks every year 
      .tickFormat(d3.timeFormat("%Y"))) // Format the tick labels to show Year
    .call(g => g.select(".domain").remove()) // Remove the x-axis line
    .selectAll(".tick line") // Select all tick lines
    .style("stroke-opacity", 0)
  svg.selectAll(".tick text")
    .attr("fill", "#777");

  // Add vertical gridlines
  svg.selectAll("xGrid")
    .data(x.ticks().slice(1))
    .join("line")
    .attr("x1", d => x(d))
    .attr("x2", d => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#e0e0e0")
    .attr("stroke-width", .5);

  // Add the y-axis
  svg.append("g")
    .style("font-size", "14px")
    .call(d3.axisLeft(y)
      .ticks((d3.max(data, d => d.Close) - 0) / 5000)
      .tickFormat(d => {
        if (isNaN(d)) return "";
        return `${(d / 1000).toFixed(0)}k`;
      })
      .tickSize(0)
      .tickPadding(10))
    .call(g => g.select(".domain").remove()) // Remove the y-axis line
    .selectAll(".tick text")
    .style("fill", "#777") // Make the font color grayer
    .style("visibility", "visible");
    /* (d, i, nodes) => {
      if (i === 0) {
        return "hidden"; // Hide the first and last tick labels
      } else {
        return "visible"; // Show the remaining tick labels
      }
    });*/

  // Add Y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#777")
    .style("font-family", "sans-serif")
    .text("Price [USD]");

  // Add horizontal gridlines
  svg.selectAll("yGrid")
    .data(y.ticks((d3.max(data, d => d.Close) - 0) / 5000).slice(0))
    .join("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))
    .attr("stroke", "#e0e0e0")
    .attr("stroke-width", .5)

  // Add the line path
  const path = svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr("d", line);

  // Add a circle element

  const circle = svg.append("circle")
    .attr("r", 0)
    .attr("fill", "steelblue")
    .style("stroke", "white")
    .attr("opacity", .70)
    .style("pointer-events", "none");
  // create a listening rectangle

  const listeningRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height);

  // create the mouse move function

  listeningRect.on("mousemove", function (event) {
    const [xCoord] = d3.pointer(event, this);
    const bisectDate = d3.bisector(d => d.Date).left;
    const x0 = x.invert(xCoord);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    const xPos = x(d.Date);
    const yPos = y(d.Close);


    // Update the circle position

    circle.attr("cx", xPos)
      .attr("cy", yPos);

    // Add transition for the circle radius

    circle.transition()
      .duration(50)
      .attr("r", 5);

    // add in  our tooltip

    tooltip
      .style("display", "block")
      .style("left", `${xPos + 100}px`)
      .style("top", `${yPos + 50}px`)
      .html(`<strong>Date:</strong> ${d.Date.toLocaleDateString()}<br><strong>Price:</strong> ${d.Close !== undefined ? (d.Close).toFixed(0) + ' USD' : 'N/A'}`)
  });
  // listening rectangle mouse leave function

  listeningRect.on("mouseleave", function () {
    circle.transition()
      .duration(50)
      .attr("r", 0);

    tooltip.style("display", "none");
  });

  // Add the chart title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", margin.left - 115)
    .attr("y", margin.top - 100)
    .style("font-size", "24px")
    //.style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .text("Bitcoin Price in USD since September 2014");

  // Add the source credit
  svg.append("text")
    .attr("class", "source-credit")
    .attr("x", width - 1125)
    .attr("y", height + margin.bottom - 3)
    .style("font-size", "9px")
    .style("font-family", "sans-serif")
    .text("Source: https://finance.yahoo.com/");

});
