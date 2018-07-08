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

function createRectangle(x,y,width,height,svg_name) {
	var rect = document.createElementNS(svgns, "rect");

}

function createCircle(cx, cy, radius, color, stroke) {
	var circle = document.createElementNS(svgns, "circle");
	circle.setAttributeNS(null, "cx", cx);

}



