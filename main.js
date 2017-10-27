var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var vertices = [];
var edges = [];
var graph = [vertices, edges];
var path = [];
var degrees = [];
var numOddDegrees = 0;
var possiblePath = false;

var numVertices = 10;

//Generate the vertices
for (var i = 0; i < numVertices; i++) {
	vertices[i] = letters[i];
}

console.log(vertices);

//Generate the edges
for (var i = 0; i < numVertices; i++) {
	var numLoops = Math.ceil(Math.random() * (numVertices - 1))

	for (var j = 0; j < numLoops; j++) { 
		var n;
		do {
			n = Math.floor(Math.random() * numVertices);
		} while (n == i);

		edges.push(vertices[i] + vertices[n]);
	}
}

//Alphabetize each element in the array
$.each(edges, function(i) {
	if (edges[i][0] > edges[i][1]) {
		edges[i] = edges[i][1] + edges[i][0];
	}
});
//Remove duplicate edges from the array
var uniqueEdges = [];
$.each(edges, function(i, el){
    if($.inArray(el, uniqueEdges) === -1) uniqueEdges.push(el);
});
edges = uniqueEdges;
//Alphabetize the whole array
edges.sort();

console.log(edges);

//Count degrees for each edge
for (var i = 0; i < vertices.length; i++) {
	degrees[i] = 0;
	for (var j = 0; j < edges.length; j++) {
		if (edges[j].split(vertices[i]).length - 1 > 0) {
			degrees[i]++;
		}
	}
}

//Count the number of odd degrees
$.each(degrees, function(i) {
	if (degrees[i] % 2 == 1) {
		numOddDegrees += 1;
	}
});

switch (numOddDegrees) {
	case 2:
		console.log("There is a possible Euler path");
		possiblePath = true;
		break;
	default:
		console.log("There is no possible Euler path");
		possiblePath = false;
		break;
}

if (possiblePath) {
	//Find the index of the first vertex with odd degree
	var firstOdd = -1;
	var i = 0;
	do {
		if (degrees[i] % 2 == 1) {
			firstOdd = i;
		}
		i++;
	} while (firstOdd == -1);
	
	//Finds the first edge that includes the vertex
	var vertex = vertices[firstOdd];
	function findEdge(edge) {
		return edge.includes(vertex);
	}

	$.each(edges, function(i) {
		//Follow the first edge at our current vertex
		//console.log(vertex);
		path[i] = edges.find(findEdge);
		//Update the current vertex
		if (path[i][0] == vertex) {
			vertex = path[i][1];
		} else {
			vertex = path[i][0];
		}
		//Delete the edge
		var index = edges.indexOf(path[i]);
		edges.splice(index, 1);
	});
}

console.log(path);