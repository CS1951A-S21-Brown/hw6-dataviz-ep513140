 var lollipop_width = (MAX_WIDTH/2) - 10
 var lollipop_height = 300;
 var lollipop = d3.select("#lollipopplot")
     .append("svg")
     .attr("width", lollipop_width)
     .attr("height", lollipop_height)
     .append("g")
     .attr("transform", `translate(${margin.left}, ${margin.top})`);



function setlollipop(year) {
    var correctYears = []
    //resets data if there were other years already plotted
    lollipop.selectAll("*").remove();

    //appends y axis label
    lollipop.append("text")
        .attr("transform",
            `translate(-60, ${(lollipop_height - margin.top - margin.bottom) / 2})`)
        .style("text-anchor", "end")
        .text("Football Team");

    //appends x axis label
    lollipop.append("text")
            .attr("transform",
                `translate(${(lollipop_width - margin.left - margin.right) / 2},
                ${(lollipop_height - margin.top - margin.bottom) + 20})`)
            .style("text-anchor", "middle")
            .text("FIFA Winning Percentage");

    //creates a tooltip for hover data
    var mouse_label = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .text("");


    //creates x axis
    var x_axis = d3.scaleLinear()
        .range([0, lollipop_width - margin.left - margin.right]);



    //creates y axis
    var y_axis = d3.scaleBand()
        .range([lollipop_height - margin.top - margin.bottom, 0]);


    //creates y axis label which will be changed depending on the data
    var y_label = lollipop.append("g").attr("id", "y_label");






    //creates title for the graph
    var title_lollipop = lollipop.append("text")
        .attr("transform", `translate(${(lollipop_width - margin.left - margin.right) / 2}, ${-20})`)
        .style("text-anchor", "middle")
        .style("font-size", 20)
        .text("Top Performing World Cup Football Teams");

    //finds correct rows in data that are in FIFA tournament and the correct years
    data.forEach(function(a){
      if (a['tournament']==='FIFA World Cup') {
        if (year==='2014') {
          if (a['date'].substring(0, 4)==='2014') {
            correctYears.push(a)
          }
        }
        if (year==='2018') {
          if (a['date'].substring(0, 4)==='2018') {
            correctYears.push(a)
          }
        }
        else {
          if (a['date'].substring(0, 4)==='2018'|| a['date'].substring(0, 4)==='2014') {
            correctYears.push(a)
          }
        }
      }
    });

    dict2 = [];
    teams2 = {};
    num2 = 0
    home_name2 = ''
    away_name2 = ''

    //calculates wins and games played for each team in FIFA and correct years
    correctYears.forEach(function(a) {
        home_name2 = a['home_team']
        away_name2 = a['away_team']
        if (teams2[home_name2]) {
          if (a['home_score']>a['away_score']) {
            dict2[teams2[home_name2]].games++;
            dict2[teams2[home_name2]].wins++;
          }
          else {
            dict2[teams2[home_name2]].games++;
          }
        }  else {
            teams2[home_name2] = num2;
            num2++;
            if (a['home_score']>a['away_score']) {
              dict2.push({attr: a['home_team'], games:1, wins:1, percent:0})
            }
            else {
              dict2.push({attr: a['home_team'], games:1, wins:0, percent:0})
            }

        }
        if (teams2[away_name2]) {
          if (a['away_score']>a['home_score']) {
            dict2[teams2[away_name2]].games++;
            dict2[teams2[away_name2]].wins++;
          }
          else {
            dict2[teams2[away_name2]].games++;
          }
        }  else {
            teams2[away_name2] = num2;
            num2++;
            if (a['away_score']>a['home_score']) {
              dict2.push({attr: a['away_team'], games:1, wins:1, percent:0})
            }
            else {
              dict2.push({attr: a['away_team'], games:1, wins:0, percent:0})
            }

        }
    });
    for (var i = 0; i < dict2.length; i++) {
      dict2[i].percent = (dict2[i].wins / dict2[i].games)* (100);
    };
    final_data2 = [];
    for (var i=0; i < dict2.length; i++) {
        final_data2.push({attr: dict2[i].attr, percent:dict2[i].percent, id: i});
    }
    final_data2 = sortData(final_data2, function(a, b) {
        return parseInt(b.percent) - parseInt(a.percent)
    }, 10);

    x_axis.domain([0, d3.max(final_data2, function(d) { return d.percent; })]);

    y_axis.domain(final_data2.map(function(d) { return d.attr }));




    lollipop.selectAll("lines")
    .data(final_data2)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", function(d) { return x_axis(d.percent); })
    .attr("y1", function(d) { return y_axis(d.attr)+10; })
    .attr("y2", function(d) { return y_axis(d.attr)+10; })
    .attr("stroke", "black")

    lollipop.selectAll("circles")
    .data(final_data2)
    .enter()
    .append("circle")
    .attr("r", "6")
    .style("fill", "lightgreen")
    .attr("cx", function(d) { return x_axis(d.percent); })
    .attr("cy", function(d) { return y_axis(d.attr)+10; })
    .attr("stroke", "black")
    .on("mouseover", function(d){return mouse_label.style("visibility", "visible").text(d.percent.toString().substring(0, 4));})
    .on("mousemove", function(){return mouse_label.style("top",
    (d3.event.pageY)+"px").style("left",(d3.event.pageX+15)+"px");})
    .on("mouseout", function(){return mouse_label.style("visibility", "hidden");});
    y_label.call(d3.axisLeft(y_axis).tickSize(0).tickPadding(5));
  }
