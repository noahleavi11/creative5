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
    let querySnapshot = await questionsRef.orderBy('id').get();
    res.send(querySnapshot.docs.map(doc => doc.data()));
})

app.post('/api/questions', async (req, res) => {
    let querySnapshot = await questionsRef.get();
    let numRecords = querySnapshot.docs.length;

    console.log(req.body.question);
    console.log(req.body.id);
    console.log(req.body.time);

    let newQuestionRef = questionsRef.doc(req.body.time);

    console.log(newQuestionRef.key);

    let setQuestion = newQuestionRef.set({
      id: req.body.time,
      question: req.body.question,
      comments: [   ],
    });
    console.log(setQuestion.key);

    res.send(setQuestion);
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
    res.send("Comment successfully added");

  } catch {
    res.status(500).send("Error editing document");
  }
})

app.delete('/api/questions/:id', async (req,res) => {
    let id = req.params.id.toString();
    console.log(id);
    var documentToDelete = questionsRef.doc(id);
    try{
        var doc = await documentToDelete.get();
        if(!doc.exists){
            res.status(404).send("Sorry, that question doesn't exist");
            return;
        }
        else{
            documentToDelete.delete();
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ",err);
    }
});

exports.app = functions.https.onRequest(app);
