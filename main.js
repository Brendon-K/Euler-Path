$(document).ready( function() {
	$("#generate").on("click", function() {
		var numVertices = $("#vInput").val();
		//Only generate within the valid bounds (only have 26 defined vertex names)
		if (numVertices > 1 && numVertices < 27 && numVertices % 1 == 0) {
			var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
			var vertices = [];
			var edges = [];
			var graph = [vertices, edges];
			var path = [];
			var degrees = [];
			var numOddDegrees = 0;
			var possiblePath = false;
			var isConnected = false;
			
			//These variables are just used for drawing
			var coords = [];
			var x0 = 450;
			var y0 = 450;
			var r = 400;	
			var c = document.getElementById("myCanvas");
			var ctx = c.getContext("2d");

			//Clear the canvas every time the button is clicked
			ctx.clearRect(0, 0, 900, 900);

			//Finds the edge that includes the vertex	
			var findVertex = '';			
			function findEdge(edge) {
				return edge.includes(findVertex);
			}

			//Counts the number of degrees on each vertex
			function countDegrees() {
				for (var i = 0; i < vertices.length; i++) {
					degrees[i] = 0;
					for (var j = 0; j < edges.length; j++) {
						//If the current edge element has the current vertex element in it, increment the number of degrees 
						if (edges[j].split(vertices[i]).length > 1) {
							degrees[i]++;
						}
					}
				}
			}

			//Generate the vertices
			for (var i = 0; i < numVertices; i++) {
				vertices[i] = letters[i];
			}

			//Draw the vertices
			for (var i = 0; i < vertices.length; i++) {
				var x = x0 + r * Math.cos(2 * Math.PI * i / vertices.length);
				var y = y0 + r * Math.sin(2 * Math.PI * i / vertices.length);
				coords[i] = [x, y];
				ctx.beginPath();
				ctx.arc(x, y, 14, 0, 2*Math.PI);
				ctx.stroke();
				ctx.closePath();
				ctx.font = "15px Courier New";
				x = x0 + (7 + r) * Math.cos(2 * Math.PI * i / vertices.length);
				y = y0 + (7 + r) * Math.sin(2 * Math.PI * i / vertices.length);
				ctx.fillText(vertices[i],x-4,y+5);
			}

			console.log(vertices);

			//Loop until a graph with an Euler Path is found
			do {
				//Reset the variables every loop
				edges = [];
				uniqueEdges = [];
				degrees = [];
				numOddDegrees = 0;

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

				//Count the number of odd degrees
				countDegrees();
				$.each(degrees, function(i) {
					if (degrees[i] % 2 == 1) {
						numOddDegrees += 1;
					}
				});
			} while(numOddDegrees != 2);

			console.log(edges);

			//Test if the graph is connected
			for (var i = 1; i < vertices.length; i++) {
				findVertex = vertices[0];
				if (edges.find(findEdge) != 'undefined') {
					isConnected = true;
				} else {
					isConnected = false;
					break;
				}
			}

			if (numOddDegrees <= 2 && isConnected) {
				console.log("There is a possible Euler path");
				possiblePath = true;
			} else {
				console.log("There is no possible Euler path");
				possiblePath = false;
				ctx.font="64px Courier New";
				ctx.fillText("No possible Euler Path", 25, 400);
			}

			if (possiblePath) {
				//Find the index of the first and last vertex with odd degree
				var firstOdd = -1;
				var lastOdd = -1;
				var i = 0;
				do {
					if (degrees[i] % 2 == 1) {
						firstOdd = i;
					}
					i++;
				} while (firstOdd == -1);
				do {
					if (degrees[i] % 2 == 1) {
						lastOdd = i;
					}
					i++;
				} while (lastOdd == -1);

				var vertex = vertices[firstOdd];
				var endVertex = vertices[lastOdd];

				//Display the start vertex
				ctx.font = "20px Courier New";
				ctx.fillText("START", coords[vertex.charCodeAt(0) - 97][0], coords[vertex.charCodeAt(0) - 97][1])

				//Find the Euler Path
				$.each(edges, function(i) {
					//Move the pen to the current vertex
					var x1 = coords[vertex.charCodeAt(0) - 97][0];
					var y1 = coords[vertex.charCodeAt(0) - 97][1];
					ctx.moveTo(x1, y1);

					//Keep track of vertices that reach degree 0
					countDegrees();
					var connectedVertices = [];
					for (var j = 0; j < vertices.length; j++) {
						if (degrees[j] > 0) {
							connectedVertices.push(vertices[j]);
						}
					}

					//Follow the first edge at our current vertex
					findVertex = vertex;
					var nextEdge = edges.find(findEdge);

					var tempEdges = [];

					//De-prioritize the last vertex
					if (vertex != endVertex) {
						if (nextEdge[0] == endVertex || nextEdge[1] == endVertex) {
							//Create a copy of edges array
							tempEdges = edges.slice(0);
							tempEdges.splice(tempEdges.indexOf(nextEdge), 1);
							nextEdge = tempEdges.find(findEdge);
						} 
					}

					//Check if the deletion of the edge would disconnect the graph
					tempEdges = edges.slice(0);
					tempEdges.splice(tempEdges.indexOf(nextEdge), 1);
					for (var j = 1; j < vertices.length; j++) {
						findVertex = vertices[0];
						if (tempEdges.find(findEdge) != 'undefined') {
							isConnected = true;
						} else {
							isConnected = false;
							break;
						}
					}

					//If the graph will disconnect, find a new edge to follow
					if (!isConnected) {
						nextEdge = tempEdges.find(findEdge);
					}

					if (typeof nextEdge != 'undefined') {
						path[i] = nextEdge;
					} else {
						findVertex = vertex;
						path[i] = edges.find(findEdge);
					}

					//Update the current vertex
					if (path[i][0] == vertex) {
						vertex = path[i][1];
					} else {
						vertex = path[i][0];
					}

					//Draw the edge
					var x2 = coords[vertex.charCodeAt(0) - 97][0];
					var y2 = coords[vertex.charCodeAt(0) - 97][1];
					ctx.lineTo(x2, y2);
					ctx.stroke();
					ctx.font="30px Courier New";
					ctx.fillText(i+1, x1 + (x2-x1)/4, y1 + (y2-y1)/4);
					//Delete the edge
					var index = edges.indexOf(path[i]);
					edges.splice(index, 1);
				});

				//Display the end vertex
				ctx.font = "20px Courier New";
				ctx.fillText("END", coords[vertex.charCodeAt(0) - 97][0], coords[vertex.charCodeAt(0) - 97][1])
			}

			console.log(path);
			console.log(' ');
		}
	});
});