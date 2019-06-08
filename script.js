let app = new Vue({
  el: '#app',
  data: {
    nextQuestionNumber: '1',
    selectedQuestionNumber: '',
    addedQuestion: '',
    addedName: '',
    addedComment: '',
    comments: {    },
    questions: {
      // 1 : "my question",
    },
    loading: false,
  },
  methods: {
    addComment() {
      if (!(this.selectedQuestionNumber in this.comments))
        Vue.set(app.comments, this.selectedQuestionNumber, new Array);
      this.comments[this.selectedQuestionNumber].push({
        author: this.addedName,
        text: this.addedComment
        //time: moment().format('LLLL')
      });
      this.addedName = '';
      this.addedComment = '';
    },
    addQuestion() {
      Vue.set(app.questions, this.nextQuestionNumber, { id: this.nextQuestionNumber , question: this.addedQuestion} );
      this.nextQuestionNumber = parseInt(this.nextQuestionNumber) + 1;
      this.addedQuestion = '';
    },
    select(id) {
      this.selectedQuestionNumber = id;
    }
  }
})
