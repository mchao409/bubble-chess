// Functions to create SVG path, circle, and rectangle elements

svgns = "http://www.w3.org/2000/svg";

function createPath(point_1, point_2, svg_id, class_name) {
	var svg = d3.select("#" + svg_id)
	var input = "M" + point_1[0] + "," + point_1[1] + 
			" L" + point_2[0] + "," + point_2[1];
	var path = svg.append("path")
		.attr("d", input)
		.attr("class", class_name);


	// var path = document.createElementNS(svgns, "path");

	// path.setAttributeNS(null, 'd', input);
	// path.setAttributeNS(null, 'class', class_name);
	// document.getElementById(svg_name).appendChild(path);
	return path;
}

function createCircle(cx, cy, radius, svg_id, class_name) {
	var svg = d3.select("#" + svg_id)
	var circle = svg.append("circle")
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("r", radius)
		.attr("class", class_name)
	// var circle = document.createElementNS(svgns, 'circle');
	// circle.setAttributeNS(null, 'cx', cx);
	// circle.setAttributeNS(null, 'cy', cy);
	// circle.setAttributeNS(null, 'r', radius);
	// circle.setAttributeNS(null, 'class', class_name);
	// document.getElementById(svg_name).appendChild(circle);
	return circle;
}

function createRectangle(x,y,width,height,svg_id, class_name) {
	var svg = d3.select("#" + svg_id)
	var rect = svg.append("rect")
		.attr("x", x)
		.attr("y", y)
		.attr("height", height)
		.attr("width", width)
		.attr("class", ckass_name)
	// var rect = document.createElementNS(svgns, 'rect');
	// rect.setAttributeNS(null,'x', x);
	// rect.setAttributeNS(null, 'y', y);
	// rect.setAttributeNS(null, 'height', height);
	// rect.setAttributeNS(null,'width', width);
	// rect.setAttributeNS(null, "class", class_name);
	// document.getElementById(svg_id).appendChild(rect);
	return rect;
}





