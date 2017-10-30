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
			

			var coords = [];
			var x0 = 450;
			var y0 = 450;
			var r = 400;	
			var c = document.getElementById("myCanvas");
			var ctx = c.getContext("2d");

			//Clear the canvas every time the button is clicked
			ctx.clearRect(0, 0, 900, 900);

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
			} while(numOddDegrees != 2);

			switch (numOddDegrees) {
				case 2:
					console.log("There is a possible Euler path");
					possiblePath = true;
					break;
				default:
					console.log("There is no possible Euler path");
					possiblePath = false;
					ctx.font="64px Courier New";
					ctx.fillText("No possible Euler Path", 25, 400);
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

				//Display the start vertex
				ctx.fillText("START", coords[vertex.charCodeAt(0) - 97][0], coords[vertex.charCodeAt(0) - 97][1])

				//Draw the edges
				$.each(edges, function(i) {
					var x1 = coords[vertex.charCodeAt(0) - 97][0];
					var y1 = coords[vertex.charCodeAt(0) - 97][1];
					ctx.moveTo(x1, y1);
					//Follow the first edge at our current vertex
					path[i] = edges.find(findEdge);
					//Update the current vertex
					if (path[i][0] == vertex) {
						vertex = path[i][1];
					} else {
						vertex = path[i][0];
					}
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
			}

			console.log(path);
		}
	});
});