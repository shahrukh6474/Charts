function heatmapChart(data) {
    var colors = ['#5E4FA2', '#3288BD', '#66C2A5', '#ABDDA4', '#E6F598', '#F6FAAA', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142'].reverse();
    var margin = { top: 80, right: 0, bottom: 100, left: 30 },
        width = 960 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize * 2,
        buckets = 5,
        days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        times = ["12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"];
    datasets = ["data.tsv", "data2.tsv"];
    var colors = ['#FF0000', '#E6C941', '#58C172', '#00B050'].reverse();
    var colorArray = ['#FF0000', '#E6C941', '#58C172', '#00B050'];

    if (d3.select('.heatmapsvg') && d3.select('.heatmapsvg')[0][0]) {
        d3.select('.heatmapsvg').remove();
    }
    var svg = d3.select("#heatmapchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('class', 'heatmapsvg')
        .append("g")
        .attr('class', 'heatmapg')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

    var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, i) { return i * gridSize; })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", function (d, i) {
            return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
        });

    var colorScale = d3.scale.linear()
        .domain([0, 4, 4.50, 4.75, 5])
        .range(colorArray)

    var cards = svg.selectAll(".hour")
        .data(data, function (d) { return d.day + ':' + d.hour; });

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function (d) { return (d.hour) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", function (d, i) {

            return "hour bordered tiles hr" + d.hour;
        })
        .attr("width", 0)
        .attr("height", 0)
        .style("fill", function (d, i) {
            return colorScale(d.value);
        });

    cards.transition().duration(1000)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .attr("x", function (d) { return (d.hour - 1) * gridSize; })
        .attr("y", function (d) { return (d.day - 1) * gridSize; })

    d3.selectAll('.tiles')
        .on('mouseover', function (d, i) {
            $('.x text').css('opacity', 0)
            $('.hr' + d.hour + '.text').parent('g').addClass('visiblex');
            $('.bar.hr' + d.hour).css('fill', '#444');
        })
        .on('mouseout', function (d) {
            $('.x text').css('opacity', 1);
            $('.hr' + d.hour + '.text').parent('g').removeClass('visiblex');
            $('.bar.hr' + d.hour).css('fill', '#DDDDDD');
        })



    cards.select("title").text(function (d) { return d.value; });

    cards.exit().remove();

    var svgDefs = svg.append('defs');

    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient');
    var mainGradient2 = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient2');
    var mainGradient3 = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient3');
    var mainGradient4 = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient4')

    // Create the stops of the main gradient. Each stop will be assigned
    // a class to style the stop using CSS.
    mainGradient.append('stop')
        .attr('class', 'stop-left-5')
        .attr('offset', '0');

    mainGradient.append('stop')
        .attr('class', 'stop-right-5')
        .attr('offset', '1');

    mainGradient2.append('stop')
        .attr('class', 'stop-left-47')
        .attr('offset', '0');

    mainGradient2.append('stop')
        .attr('class', 'stop-right-47')
        .attr('offset', '1');

    mainGradient3.append('stop')
        .attr('class', 'stop-left-45')
        .attr('offset', '0');

    mainGradient3.append('stop')
        .attr('class', 'stop-right-45')
        .attr('offset', '1');

    mainGradient4.append('stop')
        .attr('class', 'stop-left-0')
        .attr('offset', '0');

    mainGradient4.append('stop')
        .attr('class', 'stop-right-0')
        .attr('offset', '1');

    var legendRanges = ['5.0', '4.75', '4.5', '4']
    var legend = svg.selectAll(".legend")
        .data(legendRanges)

    legend.enter().append("g")
        .attr("class", "legend");


    var legendY = -65;
    var array = ['url(#mainGradient)', 'url(#mainGradient2)', 'url(#mainGradient3)','url(#mainGradient4)']
    legend.append("rect")
        .attr("x", function (d, i) { return legendElementWidth * i; })
        .attr("y", - ((margin.bottom + margin.left) / 2))
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 4)
        .attr('class', 'legendrect')
        .style("fill", function (d, i) {

            return array[i];
            // return colors[i]; 
        });

    legend.append("text")
        .attr("class", "mono")
        .text(function (d) {
            return "≥ " + (d);
        })
        .attr("x", function (d, i) { return legendElementWidth * i; })
        .attr("y", (- ((margin.bottom + margin.left) / 2)) + gridSize/2);

    legend.exit().remove();






};