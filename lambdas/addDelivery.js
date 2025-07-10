// const { getDistanceAndTime } = require("./utils/ors");

// exports.handler = async (event) => {
//   const ORS_API_KEY = process.env.ORS_API_KEY;

//   try {
//     const body = JSON.parse(event.body);
//     const { from, to } = body;

//     const { distanceKm, durationMin } = await getDistanceAndTime(from, to, ORS_API_KEY);

//     // You can now store this in DynamoDB or return it to the frontend
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: "Delivery calculated successfully",
//         from,
//         to,
//         distance: `${distanceKm.toFixed(2)} km`,
//         estimatedTime: `${durationMin.toFixed(2)} minutes`
//       })
//     };
//   } catch (err) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message })
//     };
//   }
// };



const { getDistanceAndDuration } = require("./utils/ors");
const { getDistanceAndTime } = require("./utils/ors");
const { v4: uuidv4 } = require("uuid"); // Optional for packageId
require("dotenv").config();




exports.handler = async (event) => {
  const { from, to } = event;
 
  if (!from || !to) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Both 'from' and 'to' addresses are required." })
    };
  }

  try {
    const result = await getDistanceAndTime(from, to, process.env.ORS_API_KEY);
    console.log(result);

    const response = {
      packageId: uuidv4(),
      from,
      to,
      distance: result.distanceKm,
      duration: result.durationMin,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    console.log("Generated delivery:", response);

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};


if (require.main === module) {
  const testEvent = {
    from: "Somalingapalem , Elamanchili,Anakapalli , AndhraPradesh",
    to: "Hyderabad,Telangana"
  };

  exports.handler(testEvent, {}).then((res) => {
    console.log("Lambda output:", res);
  }).catch((err) => {
    console.error("Lambda error:", err);
  });
}
