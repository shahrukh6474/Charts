function rendertruliabar(data, parent) {

    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
        width = 350 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // Parse the date / time


    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6);
    // .tickFormat(d3.time.format("%Y-%m"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
    // .ticks(10);
 if (d3.selectAll('.simplebargelment') && d3.selectAll('.simplebargelment')[0][0]) {
        d3.selectAll('.simplebargelment').remove();
        d3.selectAll('.simplebarSvg').remove();
        d3.select(parent).empty();
    }


    var barsvg = d3.select(parent).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('class', 'simplebarSvg')
        .append("g")
        .attr('class', 'simplebargelment')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv("bar-data.csv", function(error, data) {



    x.domain(data.map(function (d) { return d.letter; }));
    y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

    barsvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    barsvg.append("g")
        .attr("class", "x-axis-hidden")
        .attr("transform", "translate(0," + height + ")")
        // .style('opacity', '0')
        .call(xAxis)
    // .selectAll("text")
    // .style("text-anchor", "end")
    // .attr("dx", "-.8em")
    // .attr("dy", "-.55em")
    // .attr("transform", "rotate(-90)");

    barsvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    // .append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 6)
    // .attr("dy", ".71em")
    // .style("text-anchor", "end")
    // .text("Value ($)");

    barsvg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr('class', function (d, i) {
            // console.log(d, i)
            return 'bar' + ' hr' + (i + 1);
        })
        .style("fill", "#DDDDDD")
        .attr('y', height)
        .attr("height", 0)
        .transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.frequency); })
        .attr("height", function (d) { return height - y(d.frequency); });

    d3.selectAll('.x text').each(function (d, i) {
        // console.log(i);
        if (i % 3 == 0) {
            $(this).addClass('visibleText');
        } else {
            $(this).addClass('removeText');
        }
    });


    d3.selectAll('.x-axis-hidden text').each(function (d, i) {
        // console.log(i);
        if (i % 3 == 0) {
            $(this).addClass('hr' + (i + 1) + ' text');
        } else {
            $(this).addClass('hr' + (i + 1) + ' text');
        }
    });

    d3.selectAll('.x-axis-hidden .tick').each(function (d, i) {
        $(this).css('opacity', 0)

    })

}