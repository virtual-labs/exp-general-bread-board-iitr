// create a graph class 
class Graph {
    // defining vertex array and 
    // adjacent list 
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
        this.numberofedges=0;
    }


    // add vertex to the graph 
    addVertex(v) {
        // initialize the adjacent list with a 
        // null array 
        this.AdjList.set(v, []);
    }


    // add edge to the graph 
    addEdge(v, w) {
        // get the list for vertex v and put the 
        // vertex w denoting edge between v and w 
        this.AdjList.get(v).push(w);

        // Since graph is undirected, 
        // add an edge from w to v also 
        this.AdjList.get(w).push(v);
        this.numberofedges++;
    }

    // Prints the vertex and adjacency list 
    printGraph() {
        // get all the vertices 
        var get_keys = this.AdjList.keys();

        // iterate over the vertices 
        for (var i of get_keys) {
            // great the corresponding adjacency list 
            // for the vertex 
            var get_values = this.AdjList.get(i);
            var conc = "";

            // iterate over the adjacency list 
            // concatenate the values into a string 
            for (var j of get_values)
                conc += j + " ";

            // print the vertex and its adjacency list 
            console.log(i + " -> " + conc);
        }
    }


    isConnected(s, d) {
        // Base case 
        if (s == d)
            return true;

        var visited = [];
        for (var i = 0; i < this.noOfVertices; i++)
            visited[i] = false;

        var q = new Queue();

        // add the starting node to the queue 
        visited[s] = true;
        q.enqueue(s);

        while (!q.isEmpty()) {
            // get the element from the queue 
            var getQueueElement = q.dequeue();

            // passing the current vertex to callback funtion 
            //console.log(getQueueElement);

            // get the adjacent list for current vertex 
            var get_List = this.AdjList.get(getQueueElement);

            // loop through the list and add the element to the 
            // queue if it is not processed yet 
            for (var i in get_List) {

                

                var neigh = get_List[i];
                if (neigh == d)
                    return true;

                if (!visited[neigh]) {
                    visited[neigh] = true;
                    q.enqueue(neigh);
                }
            }
        }

        return false;

    }


    // function to performs BFS 
    bfs(startingNode) {

        // create a visited array 
        var visited = [];
        for (var i = 0; i < this.noOfVertices; i++)
            visited[i] = false;

        // Create an object for queue 
        var q = new d3.Queue();

        // add the starting node to the queue 
        visited[startingNode] = true;
        q.enqueue(startingNode);

        // loop until queue is element 
        while (!q.isEmpty()) {
            // get the element from the queue 
            var getQueueElement = q.dequeue();

            // passing the current vertex to callback funtion 
            console.log(getQueueElement);

            // get the adjacent list for current vertex 
            var get_List = this.AdjList.get(getQueueElement);

            // loop through the list and add the element to the 
            // queue if it is not processed yet 
            for (var i in get_List) {
                var neigh = get_List[i];

                if (!visited[neigh]) {
                    visited[neigh] = true;
                    q.enqueue(neigh);
                }
            }
        }
    }
}


// Queue class 
class Queue {
    // Array is used to implement a Queue 
    constructor() {
        this.items = [];
    }

    // Functions to be implemented 
    // enqueue(item) 
    // enqueue function 
    enqueue(element) {
        // adding element to the queue 
        this.items.push(element);
    }

    // dequeue() 
    // dequeue function 
    dequeue() {
        // removing element from the queue 
        // returns underflow when called 
        // on empty queue 
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // front() 
    // front function 
    front() {
        // returns the Front element of 
        // the queue without removing it. 
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    // isEmpty() 
    // isEmpty function 
    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0;
    }

    // printQueue() 
    // printQueue function 
    printQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }

}



