svgns = "http://www.w3.org/2000/svg";
svg_board = document.getElementById("svg_board");

function createPath(point_1, point_2, color, svg_name) {
	var path = document.createElementNS(svgns, "path");
	var input = "M" + point_1[0] + "," + point_1[1] + 
			" L" + point_2[0] + "," + point_2[1];
	path.setAttributeNS(null, 'd', input);
	path.setAttribute("stroke", color);
	document.getElementById(svg_name).appendChild(path);
}

function createCircle(cx, cy, radius, color, stroke, svg_name) {
	circle.setAttributeNS(null, 'cx', cx);
	circle.setAttributeNS(null, 'cy', cy);
	circle.setAttributeNS(null, 'r', radius);
	circle.style.fill = color;
	circle.style.stroke = stroke;
	circle.style.strokeWidth = 1;
	document.getElementById(svg_name).appendChild(circle);
}

function createRectangle(x,y,width,height,fill, stroke,svg_name) {
	var rect = document.createElementNS(svgns, 'rect');
	rect.setAttributeNS(null,'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', height);
	rect.setAttributeNS(null,'width', width);
	rect.style.fill = fill;
	rect.style.stroke = stroke;
	rect.style.strokeWidth = 1;
	document.getElementById(svg_name).appendChild(rect);
}



