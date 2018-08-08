// Functions to create SVG path, circle, and rectangle elements

svgns = "http://www.w3.org/2000/svg";

function createPath(point_1, point_2, svg_id, class_name) {
	var svg = d3.select("#" + svg_id)
	var input = "M" + point_1[0] + "," + point_1[1] + 
			" L" + point_2[0] + "," + point_2[1];
	var path = svg.append("path")
		.attr("d", input)
		.attr("class", class_name);
	return path;
}

function createCircle(cx, cy, radius, svg_id, class_name) {
	var svg = d3.select("#" + svg_id)
	var circle = svg.append("circle")
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("r", radius)
		.attr("class", class_name)
	return circle;
}

function createRectangle(x,y,width,height,svg_id, class_name) {
	var svg = d3.select("#" + svg_id)
	var rect = svg.append("rect")
		.attr("x", x)
		.attr("y", y)
		.attr("height", height)
		.attr("width", width)
		.attr("class", class_name)
	return rect;
}

// Creates a pattern background for the player's bubble pieces
function createPattern(circle, num_circle, svg_id) {
	var svg = d3.select("#" + svg_id)
	var defs = svg.append("svg:defs");
	defs.append("svg:pattern")
		.attr("id", "" + num_circle + "_circle")
		.attr("width", 2 * circle_radius)
		.attr("height", 2 * circle_radius)
		.append("svg:image")
		.attr("xlink:href", "static/img/blue/" + num_circle + "blue.png")
		.attr("width", 2 * circle_radius)
		.attr("height", 2 * circle_radius)
		.attr("x", 0)
		.attr("y", 0)

	circle.attr("id", num_circle + "")
		.style("fill", "black")
		.style("fill", "url(#" + num_circle + "_circle)");
	return circle;
}



