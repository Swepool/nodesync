import fetch from "node-fetch";
import fs from 'fs'

//Fetch list of nodes
fetch("https://raw.githubusercontent.com/kryptokrona/kryptokrona-nodes-list/master/nodes.json")
  .then(res => res.json())
  .then (data => {

    //Fetch data from all nodes in list
    for(const node of data.nodes) {
      fetch("http://" + node.url + ":11898/getinfo")
        .catch(error => {
          throw(error);
        })
        .then(res => res.json())
        .then(data => {

          //only continue with nodes replying with status: "OK" and synced
          //if(data.status === "OK" && data.synced)
          renderNode(node, data)
        })
      process.on('uncaughtException', function(err) {
        console.log('problem', err);
      });
    }
  })

let nodes = []
//Render all the nodes to the table
async function renderNode(node, data) {
  nodes.push({
    nodeName: node.name,
    nodeHeight: data.height,
    connectionsIn: data.incoming_connections_count,
    connectionsOut: data.outgoing_connections_count,
    nodeSynced: data.synced,
    nodeStatus: data.status
  })
  let jsonString = JSON.stringify({ ...nodes })
  console.log(jsonString)
  test(jsonString)
}


function test(array) {
  fs.writeFile('db.json', array, (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}


