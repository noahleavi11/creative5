const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);
const app = express();

var db = firebase.firestore();
var questionsRef = db.collection('questions');

app.get('/api/questions', async(req, res) => {
    let querySnapshot = await questionsRef.get();
    res.send(querySnapshot.docs.map(doc => doc.data()));
})

app.post('/api/questions', async (req, res) => {
    let querySnapshot = await questionsRef.get();
    let numRecords = querySnapshot.docs.length;

    console.log(req.body.question);
    console.log(req.body.id);
    let newQuestion = {
        id: req.body.id,
        question: req.body.question,
        comments: '',
      };

    questionsRef.doc(newQuestion.id.toString()).set(newQuestion);
    res.send(newQuestion);
})

app.put('/api/questions/:id', async (req, res) => {
  let id = req.params.id.toString();
  console.log(id);
  console.log(req.body.author);
  console.log(req.body.text);
  try{
    questionsRef.doc(id).update({
      comments: firebase.firestore.FieldValue.arrayUnion({author: req.body.author.toString(), text: req.body.text.toString()})
    });
    console.log("Document successfully updated");

  } catch {
    res.status(500).send("Error editing document");
  }
})

// app.delete('/api/tickets/:id', async (req,res) => {
//     let id = req.params.id.toString();
//     var documentToDelete = ticketsRef.doc(id);
//     try{
//         var doc = await documentToDelete.get();
//         if(!doc.exists){
//             res.status(404).send("Sorry, that ticket doesn't exist");
//             return;
//         }
//         else{
//             documentToDelete.delete();
//             res.sendStatus(200);
//             return;
//         }
//     }catch(err){
//         res.status(500).send("Error deleting document: ",err);
//     }
// });

exports.app = functions.https.onRequest(app);
