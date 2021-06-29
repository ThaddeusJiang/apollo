import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
const db = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await db
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.createJobDefinition = functions.https.onRequest(async (req, res) => {
  const jobDefinition = req.body;
  const writeResult = await db.collection("jobDefinitions").add(jobDefinition);

  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.createJob = functions.https.onRequest(async (req, res) => {
  const job = req.body;
  const writeResult = await db.collection("jobs").add(job);

  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.getAllActiveJobDefinitions = functions.https.onRequest(
  async (req, res) => {
    const snapshot = await db
      .collection("jobDefinitions")
      .where("active", "==", true)
      .get();
    if (snapshot.empty) {
      res.json([]);
    }
    const list: FirebaseFirestore.DocumentData[] = [];
    snapshot.forEach((doc) => list.push(doc.data()));
    res.json(list);
  }
);

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });

// exports.scheduledFunctionCrontab = functions.pubsub
//   .schedule("5 * * * *")
//   .timeZone("Asia/Tokyo") // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     console.log("This will be run every day at 11:05 AM Eastern!");
//     return null;
//   });
