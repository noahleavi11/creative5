let app = new Vue({
  el: '#app',
  data: {
    nextQuestionNumber: '',
    selectedQuestionNumber: 2,
    addedQuestion: '',
    addedName: '',
    addedComment: '',
    comments: {    },
    questions: [],
    loading: false,
  },
  created() {
    this.getQuestions();
  },
  methods: {
    async getQuestions() {
      try {
        let response = await axios.get("/api/questions");
        this.questions = response.data;
        // console.log(this.questions.length);
        this.nextQuestionNumber = this.questions.length + 1;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addQuestion() {
      try {
          let response = await axios.post("/api/questions", {
            id: this.nextQuestionNumber,
            question: this.addedQuestion
          });
          // console.log("ADD Question - RESPONSE: ",response);
          this.addedQuestion = "";
          this.nextQuestionNumber = parseInt(this.nextQuestionNumber) + 1;
          // this.getTickets();
          return true;
        } catch (error) {
          console.log(error);
        }
    },
    async addComment() {
      try {
        // console.log("i am at this point");
        let response = await axios.put("/api/questions/" + this.selectedQuestionNumber, {
            author: this.addedName,
            text: this.addedComment
            //time: moment().format('LLLL')
          });
          this.addedName = '';
          this.addedComment = '';
      } catch (error) {
        console.log(error);
      }
    },
    // addComment() {
    //   if (!(this.selectedQuestionNumber in this.comments))
    //     Vue.set(app.comments, this.selectedQuestionNumber, new Array);
    //   this.comments[this.selectedQuestionNumber].push({
    //     author: this.addedName,
    //     text: this.addedComment
    //     //time: moment().format('LLLL')
    //   });
    //   this.addedName = '';
    //   this.addedComment = '';
    // },
    // addQuestion() {
    //   Vue.set(app.questions, this.nextQuestionNumber, { id: this.nextQuestionNumber , question: this.addedQuestion} );
    //   this.nextQuestionNumber = parseInt(this.nextQuestionNumber) + 1;
    //   this.addedQuestion = '';
    // },
    select(question) {
      console.log(question.id);
      this.selectedQuestionNumber = question.id;
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
