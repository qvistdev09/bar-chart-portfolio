const w = 1000,
  h = 600,
  padding = 50;

svg = d3.select('#container').append('svg').attr('width', w).attr('height', h);

svg
  .append('text')
  .text('United States GDP')
  .attr('x', '50%')
  .attr('text-anchor', 'middle')
  .attr('id', 'title')
  .attr('y', 40);

svg
  .append('text')
  .text('Gross Domestic Product')
  .attr('text-anchor', 'middle')
  .attr('id', 'left-axis-text')
  .attr('transform', 'rotate(-90)')
  .attr("x", -200)
  .attr("y", 75);

d3.json(
  'https://raw.githubusercontent.com/qvistdev09/bar-chart-portfolio/master/GDP-data.json'
).then((data) => {
  createBars(data.data);
});

const tooltip = d3.select('#container').append('div').attr('id', 'tooltip');
const tooltipUpper = tooltip
  .append('p')
  .attr('id', 'tooltip-upper')
  .html('Upper');
const tooltipLower = tooltip
  .append('p')
  .attr('id', 'tooltip-lower')
  .html('Lower');

function createBars(obj) {
  const barWidth = (w - padding * 2) / obj.length;
  const availableHeight = h - padding;

  const yScale = d3.scaleLinear();
  yScale.range([h - padding, padding]);
  const maxY = d3.max(obj, (d) => d[1]);
  yScale.domain([0, maxY]);

  const xScale = d3.scaleTime();
  xScale.range([padding, w - padding]);
  let maxX = new Date(obj[obj.length - 1][0]);
  maxX.setMonth(maxX.getMonth() + 3);
  xScale.domain([new Date(obj[0][0]), maxX]);

  svg
    .selectAll('rect')
    .data(obj)
    .enter()
    .append('rect')
    .attr('width', barWidth + 1)
    .attr('height', (d) => availableHeight - yScale(d[1]))
    .attr('fill', (d, i) => {
      return i % 2 === 0 ? '#4AC21D' : '#4B9130';
    })
    .attr('x', (d, i) => i * barWidth + padding)
    .attr('y', (d) => availableHeight - (availableHeight - yScale(d[1])))
    .attr('class', 'bar')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .on('mouseover', (d, i) => {
      tooltip
        .style('left', i * barWidth + padding + 20 + 'px')
        .attr('class', 'visible')
        .attr('data-date', d[0]);
      tooltipUpper.html(formatDate(d[0]));
      tooltipLower.html(formatMoney(d[1]));
    })
    .on('mouseleave', (d, i) => {
      tooltip.attr('class', '');
    });

  const yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('transform', 'translate(' + padding + ', 0)')
    .attr('id', 'y-axis')
    .call(yAxis);

  const xAxis = d3.axisBottom(xScale);

  svg
    .append('g')
    .attr('transform', 'translate(0, ' + (h - padding) + ')')
    .attr('id', 'x-axis')
    .call(xAxis);
}

function formatDate(string) {
  let quarter = '';
  switch (string.slice(5, 7)) {
    case '01':
      quarter = 1;
      break;
    case '04':
      quarter = 2;
      break;
    case '07':
      quarter = 3;
      break;
    case '10':
      quarter = 4;
      break;
    default:
      break;
  }
  return string.slice(0, 4) + ' Q' + quarter;
}

function formatMoney(value) {
  let converted = value.toLocaleString();
  converted = converted.replace(/,/g, '.').replace(/\s/g, ',');
  return '$' + converted + ' Billion';
}
