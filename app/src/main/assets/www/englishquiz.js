/**
 * Created by P0020755 on 18/07/2016.
 */

var Quiz = {};

$(document).ready(function () {
    $('#btnStart').on('click', Quiz.getQuestions);
    $('#btNext').on('click', Quiz.nextQuestion);
    $('#btPrevious').on('click', Quiz.previousQuestion);
    $('#btFinish').on('click', Quiz.finish);
    $('#rbAnswers').mouseover(() => $('#rbAnswers').css('cursor', 'pointer'))
});

class Question {
    constructor(question, answer1, answer2, answer3, answer4, rightAnswer) {
        this.question = question;
        this.answer1 = answer1;
        this.answer2 = answer2;
        this.answer3 = answer3;
        this.answer4 = answer4;
        this.rightAnswer = rightAnswer;
    }

    toScreen() {
        $('#question').html(this.question);
        $('#ans1Label').text(this.answer1);
        $('#ans2Label').text(this.answer2);
        $('#ans3Label').text(this.answer3);
        $('#ans4Label').text(this.answer4);
    }
}

Quiz.questions = [];
Quiz.answers = new Map();
Quiz.totalQuestions = 10;
Quiz.index = 0;

Quiz.getQuestions = function () {
    $.ajax({
        url: 'data.php',
        dataType: 'json',
        success: function (data, status, xhr) {
            console.log(status);

            Quiz.index = 0;
            Quiz.questions.length = 0;
            Quiz.answers.clear();

            if(xhr.status == 200) {
                if(data.includes('Connection failed') || data.includes('Exception')) {
                    console.log(data);
                }
                else {
                    for(let index = 0; index < data.length; index++) {
                        let q = new Question(data[index].question,
                            data[index].answer1,
                            data[index].answer2,
                            data[index].answer3,
                            data[index].answer4,
                            data[index].rightAnswer);
                        Quiz.questions.push(q);
                    }

                    $('#qIntro').hide();
                    $('#btnStart').hide();
                    $('#qusetionsContainer').show();
                    Quiz.questionToScreen();
                }
            }
            else {
                console.log('error: ' + xhr.statusText);
            }
        },
        error: function (xhr, status, error) {
            console.log(status + " " + error);
        }

        /*url: './englishQuizData.json',
        dataType: 'json',
        success: function (data, status) {
            console.log(status);

            Quiz.index = 0;
            Quiz.questions.length = 0;
            Quiz.answers.clear();

            while (Quiz.questions.length < 10) {
                let index = math.random(0, data.Q.length - 1);
                index = math.round(index);
                let temp = Quiz.questions.find(q => q.question == data.Q[index].question);
                if(temp == undefined) {
                    let q = new Question(data.Q[index].question,
                        data.Q[index].answer1,
                        data.Q[index].answer2,
                        data.Q[index].answer3,
                        data.Q[index].answer4,
                        data.Q[index].rightAnswer);
                    Quiz.questions.push(q);
                }
            }

            $('#qIntro').hide();
            $('#btnStart').hide();
            $('#qusetionsContainer').show();
            Quiz.questionToScreen();
        },
        error: function (xhr, status, error) {
            console.log(status + " " + error);
        }*/
    });

    let fiveMinutes = 60 * 5, display = $('#qTimer');
    Quiz.startTimer(fiveMinutes, display);
};

Quiz.startTimer = function (duration, display) {
    let start = Date.now(), diff, minutes, seconds;

    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            // start = Date.now() + 1000;

            clearInterval(interval);
            Quiz.finish();
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    let interval = setInterval(timer, 1000);

    /*var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60);
        seconds = parseInt(timer % 60);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);*/
};

Quiz.addUserAnswer = function () {
    let answer = $('input[name=answer]:checked', '#rbAnswers').val();
    Quiz.answers.set(Quiz.questions[Quiz.index].question, answer);
};

Quiz.questionToScreen = function () {
    $('input[name=answer]:checked').removeAttr('checked'); // uncheck all radio for the new question
    $("input[name=answer]").checkboxradio('refresh');
    Quiz.questions[Quiz.index].toScreen();

    let answer = Quiz.answers.get(Quiz.questions[Quiz.index].question);
    $("input[name=answer][value='" + answer + "']").prop("checked",true);
    $("input[name=answer]").checkboxradio('refresh');

    $('#qCounter').text((Quiz.index + 1) + " / " + Quiz.totalQuestions);

    if(Quiz.index == Quiz.questions.length - 1) {
        $('#btNext').hide();
        $('#btFinish').show();
    }
    else {
        $('#btNext').show();
        $('#btFinish').hide();
    }
};

Quiz.nextQuestion = function () {
    Quiz.addUserAnswer();
    Quiz.index++;

    if(Quiz.index < Quiz.questions.length) {
        Quiz.questionToScreen();
    }
    else {
        Quiz.index--;
    }
};

Quiz.previousQuestion = function () {
    Quiz.addUserAnswer();
    Quiz.index--;

    if(Quiz.index > -1) {
        Quiz.questionToScreen();
    }
    else {
        Quiz.index++;
    }
};

Quiz.finish = function () {
    Quiz.addUserAnswer();

    let userScore = 0;
    Quiz.answers.forEach((value, key) => {
        let temp = Quiz.questions.find(q => q.question == key);
        if(temp.rightAnswer == value) {
            userScore += (100 / Quiz.totalQuestions);
        }
    });

    //$('#qIntro').show();
    $('#btnStart').html('New Quiz').show();
    $('#qusetionsContainer').hide();
    $("#score").html(userScore);
    $("#resultPopup").popup('open');
};
