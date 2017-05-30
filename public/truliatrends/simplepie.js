function plotsimpepie(data) {

    var width = 170,
        height = 170,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#DDDDDD", "#CCCCCC"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) { return d.population; });

    if (d3.selectAll('.simplepiegElement') && d3.selectAll('.simplepiegElement')[0][0]) {
        d3.selectAll('.simplepiegElement').remove();
        d3.selectAll('.simplepieSvg').remove();
        d3.select("#piechart").empty();
    }

    var svg = d3.select("#piechart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('class', 'simplepieSvg')
        .append("g")
        .attr('class', 'simplepiegElement')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", function(d){
            // console.log(d);
            return "arc " + d.data.gender;
        });

    g.append("path")
        // .attr("d", arc)
        .style("fill", function (d) { return color(d.data.gender); })
        .transition()
        .duration(2000)
        .attrTween('d', function (d) {
            var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function (t) {
                return arc(interpolate(t));
            };
        });

}