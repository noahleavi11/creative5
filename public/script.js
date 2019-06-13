let app = new Vue({
  el: '#app',
  data: {
    nextQuestionNumber: '',
    selectedQuestionNumber: '',
    addedQuestion: '',
    addedName: '',
    addedComment: '',
    questions: [],
    loading: true,
    myTime: '',
  },
  created() {
    this.getQuestions();
  },
  methods: {
    async getQuestions() {
      try {
        this.loading = true;
        let response = await axios.get("/api/questions");
        this.questions = response.data;

        this.nextQuestionNumber = this.questions.length;
        this.loading = false;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addQuestion() {
      if(this.addedQuestion === ''){
        return;
      }
      try {
          this.myTime = moment().format();
          console.log(this.myTime);
          let response = await axios.post("/api/questions", {
            question: this.addedQuestion,
            time: this.myTime
          });
          // console.log("ADD Question - RESPONSE: ",response);
          this.addedQuestion = '';
          this.myTime = '';
          this.nextQuestionNumber = parseInt(this.nextQuestionNumber) + 1;
          // this.getTickets();
          return true;
        } catch (error) {
          console.log(error);
        }
    },
    async addComment() {
      if(this.addedName === '' || this.addedComment === ''){
        console.log("No username or no comment");
        return;
      }
      try {
        // console.log("i am at this point");
        var questionKey = this.questions[this.selectedQuestionNumber].id;
        let response = await axios.put("/api/questions/" + questionKey, {
          author: this.addedName,
          text: this.addedComment,
          // time: moment().format('LLLL')
        });
        this.addedName = '';
        this.addedComment = '';
        this.getQuestions();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteQuestion(id) {
      console.log(id);
      try {
        let response = await axios.delete("/api/questions/" + id);
        console.log("Question was deleted");
        this.getQuestions();
        return true;
      } catch (e) {
        console.log(e);
      }
    },
    select(question) {
      var myID = 0;
      console.log(this.questions.length);
      for(var i = 0; i < this.questions.length; i++){
        console.log(question.id);
        console.log(this.questions[i].id);
        if(question === this.questions[i]){
          myID = i;
          break;
        }
      }
      console.log(myID);
      this.selectedQuestionNumber = myID;
      console.log(this.selectedQuestionNumber);
    }
  },
  watch: {
    nextQuestionNumber(value, oldvalue) {
      if(oldvalue !== '') {
        this.getQuestions();
      }
    }
  }
})
