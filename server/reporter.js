/**
 * Hello Sift Sift. DAG's 'Node1' node implementation
 */
'use strict';

// Entry point for DAG node
// got ={
//   in: ... // contains the key/value pairs that match the given query
//   with: ... // key/value pairs selected based on the with selection
//   lookup: ... // an array with result of lookup for a specific key
//   query: ... // an array containing the key hierarchy
// }
// for more info have a look at:
// http://docs.redsift.com/docs/server-code-implementation
module.exports = function (got) {
  const inData = got.in;

  // console.log('OTRACKS: data received:', inData);
  //
  // console.log("OTRX: ", inData.data[0].key, inData.data[0].value.toString())

  const hookData = inData.data.map(d => JSON.parse(d.value));

 //Normalize the data from Owntracks to the internal device format

  let devData = hookData.reduce((na, d)=>{
    na.push( {
      name: "devices",
      key: d.tid,
      value: {
        type: "Owntracks",
        lat: d.lat,
        lng: d.lon,
        time: d.tst
      }
    }),
    na.push( {
      name: "device_events",
      key: d.tid,
      value: {
        type: "Owntracks",
        lat: d.lat,
        lng: d.lon,
        time: d.tst
      }
    })
    na.push({
      name: "positions",
      key: d.tid + "/" + d.tst,
      value: {
        lat: d.lat,
        lng: d.lon,
        time: d.tst
      }
    })
    return na;
  }, []);


  console.log("OTRACKS ", devData )

  return  devData;
};
