var bar_width2 = (MAX_WIDTH/2) - 10
var bar_height2 = 300;


var barplot = d3.select("#barplot")
    .append("svg")
    .attr("width", bar_width2)
    .attr("height", bar_height2)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);



var y_count2 = barplot.append("g");

var y_label = barplot.append("g").attr("id", "y_bar_label");


var x_axis = d3.scaleLinear()
    .range([0, bar_width2 - margin.right - margin.left]);


var y_axis = d3.scaleBand()
    .range([0, bar_height2 - margin.bottom - margin.top]);


barplot.append("text")
    .attr("transform",
        `translate(${(bar_width2 - margin.right - margin.left) / 2},
        ${(bar_height2 - margin.bottom - margin.top) + 15})`)
    .style("text-anchor", "middle")
    .text("Winning Percentage");


barplot.append("text")
    .attr("transform", `translate(-120, ${(bar_height2 - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle").text("Football Team");


barplot.append("text")
    .attr("transform", `translate(${(bar_width2 - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .text(`Top 10 Teams By Winning Percentage`);


var map_color = d3.scaleOrdinal()
    .range(d3.quantize(d3.interpolateHcl("green", "lightgreen"), 10));

function setBar() {
    var dict = [];
    var teams = {};
    var num = 0
    var home_name = ''
    var away_name = ''
    data.forEach(function(a) {
        home_name = a['home_team']
        away_name = a['away_team']
        if (teams[home_name]) {
          if (a['home_score']>a['away_score']) {
            dict[teams[home_name]].games++;
            dict[teams[home_name]].wins++;
          }
          else {
            dict[teams[home_name]].games++;
          }
        }  else {
            teams[home_name] = num;
            num++;
            if (a['home_score']>a['away_score']) {
              dict.push({attr: a['home_team'], games:1, wins:1, percent:0})
            }
            else {
              dict.push({attr: a['home_team'], games:1, wins:0, percent:0})
            }

        }
        if (teams[away_name]) {
          if (a['away_score']>a['home_score']) {
            dict[teams[away_name]].games++;
            dict[teams[away_name]].wins++;
          }
          else {
            dict[teams[away_name]].games++;
          }
        }  else {
            teams[away_name] = num;
            num++;
            if (a['away_score']>a['home_score']) {
              dict.push({attr: a['away_team'], games:1, wins:1, percent:0})
            }
            else {
              dict.push({attr: a['away_team'], games:1, wins:0, percent:0})
            }

        }
    });

    for (var i = 0; i < dict.length; i++) {
      dict[i].percent = (dict[i].wins / dict[i].games)* (100);
    };

    var final_data = [];
    for (var i=0; i < dict.length; i++) {
        final_data.push({attr: dict[i].attr, percent:dict[i].percent, id: i});
    }
    final_data = sortData(final_data, function(a, b) {
        return parseInt(b.percent) - parseInt(a.percent)
    }, 10);

    x_axis.domain([0, d3.max(final_data, function(d) { return parseInt(d.percent); })]);

    y_axis.domain(final_data.map(function(d) { return d.attr }));
    map_color.domain(final_data.map(function(d) { return d.attr }));


    y_label.call(d3.axisLeft(y_axis).tickSize(0).tickPadding(5));
    var team_bar = barplot.selectAll("bars").data(final_data);

    team_bar.enter()
        .append("rect")
        .merge(team_bar)
        .attr("fill", function(d) { return map_color(d.attr) })
        .attr("x", x_axis(0))
        .attr("y", function(d) { return y_axis(d.attr); })
        .attr("width", function(d) { return x_axis(parseInt(d.percent)); })
        .attr("height",  y_axis.bandwidth() - 3);

    var percents = y_count2.selectAll("text").data(final_data);

    percents.enter()
        .append("text")
        .merge(percents)
        .attr("x", function(d) { return x_axis(parseInt(d.percent)) + 10; })
        .attr("y", function(d) { return y_axis(d.attr) + 10; })
        .style("text-anchor", "start")
        .text(function(d) {return parseInt(d.percent);});
}
