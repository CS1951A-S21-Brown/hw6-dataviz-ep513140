var scatter_width = (MAX_WIDTH/2) -10
var scatter_height = 300;


var scatter = d3.select("#scatterplot")
    .append("svg")
    .attr("width", scatter_width)
    .attr("height", scatter_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


var x_axis = d3.scaleLinear()
    .range([0, scatter_width - margin.left - margin.right]);

var y_axis = d3.scaleBand()
    .range([scatter_height - margin.top - margin.bottom, 0]);


var y_count = scatter.append("g");

var y_axis_label = scatter.append("g").attr("id", "y_axis_label");

scatter.append("text")
    .attr("transform",
        `translate(${(scatter_width - margin.left - margin.right) / 2},
        ${(scatter_height - margin.top - margin.bottom) + 15})`)
    .style("text-anchor", "middle")
    .text("Football Games");

var y_axis_text = scatter.append("text")
    .attr("transform", `translate(-120, ${(scatter_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle").text("Year");

var title = scatter.append("text")
    .attr("transform", `translate(${(scatter_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 20).text("Football Games Per Year");


function setScatter() {
    for (var i=0; i<data.length; i++){
      data[i]['date'] = data[i]['date'].substring(0, 4);
    }
    var hash = {};
    data.forEach(function(a) {
        var year = a['date'];
        if (hash[year]) {
            hash[year] += 1;
        }  else {
            hash[year] = 1;
        }
    });

    var final_data = [];
    Object.keys(hash).forEach(function(a) {
      final_data.push({attr: a, count: hash[a]});
    });
    final_data = sortData(final_data, function(a, b) {
        return parseInt(b.attr) - parseInt(a.attr)
    }, 5);
    x_axis.domain([0, d3.max(final_data, function(d) { return d.count; })]);
    y_axis.domain(final_data.map(function(d) { return d.attr }));
    y_axis_label.call(d3.axisLeft(y_axis).tickSize(0).tickPadding(15));
    scatter.selectAll("circles")
  .data(final_data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x_axis(d.count); })
    .attr("cy", function(d) { return y_axis(d.attr)+20; })
    .attr("r", "6")
    .style("fill", "lightgreen")
    .attr("stroke", "black")

    var game_num = y_count.selectAll("text").data(final_data);
    game_num.enter()
        .append("text")
        .merge(game_num)
        .attr("x", function(d) { return x_axis(d.count) + 10; })
        .attr("y", function(d) { return y_axis(d.attr) + 25; })
        .style("text-anchor", "start")
        .text(function(d) {return d.count;});
}
