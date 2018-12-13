var root_url = "http://comp426.cs.unc.edu:3002/api/";

$(document).ready(function() {
    //Login 
    $("#login").on("click", function () {
        let user = $("#user").val();
        let pass = $("#pass").val();

        $.ajax(root_url + 'login',
            {
                type: 'GET',
                xhrFields: {withCredentials: true},
                data: {
                    username: user,
                    password: pass
                },
                success: function (response) {
                    if (response.status) {
                        $('#status').html("Login successful...");
                        build_QI();
                    } else {
                        $('#status').html("Login failed. Try again.");
                    }
                },
                error: function () {
                    alert('error');
                }
            });
    });

    function build_QI() {

        let body = $('body');
    
        body.empty();

        body.html('<nav class="navbar"><button class="navbar-item button" id="home">Home </button><button class="navbar-item button" id="review">' +
            'Review</button><p style="margin-left: 5px;" class="navbar-item">reesb</p><button class="navbar-item button" id="logout">Logout</button></nav><section ' +
            'class="section header-section"><div class="container header-container"><h1 class="title">Welcome to the ' +
            '426 website</h1><h1 class="subtitle">Answer and Review questions!</h1><button class="reset button">Reset Answers (only press if serious, there\'s no confir' +
            'mation)</button></a><div class="dropdown"><button class="dropdown-button button">Sort Menu <i class="d' +
            'own"></i></button><div class="dropdown-content"><button class="button natural alphaSort">Sort Questions ' +
            'Alphabetically (Asc)</button><button class="button alphaSort">Sort Questions Alphabetically (Desc)</butt' +
            'on><button class="button natural aCountSort">Sort Questions By Answer Count (Asc)</button><button class=' +
            '"button aCountSort">Sort Questions By Answer Count (Desc)</button></div></div><input class="input" id="s' +
            'earchText" type="text" placeholder="Filter questions for..."></div><ul class="intro-text"><li>Questions ' +
            'are sorted so that answered question appear at the bottom of the list.</li><li>Questions can be sorted b' +
            'y alphabetical order or by the number of answers, both in ascending or descending order (accessible from '+
            'the dropdown \'Sort Menu\' above).</li><li>All question answer forms can be shown or hidden by clicki' +
            'ng the \'Show/Hide Question\' button below each question.</li><li>Any question text can be searched by ' +
            'using the \'Filter questons\' box above.</li><li>The number of total answers for each question can be se' +
            'en to the right of each question as part of the \'answercount\' field.</li></ul></section><hr'); //clear body

        body.append('<h1 class="title questions-title">Questions: 31</h1>');

        let qlist = $('<div class="container questions-container"></div>');

        body.append(qlist);

        $.ajax(root_url + "questions",
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    let qarray = response.data;
                    for (let i = 0; i < qarray.length; i++) {
                        let qdiv = create_question_div(qarray[i]);
                        qlist.append(qdiv);
                        let qid = qarray[i].id
                        $.ajax(root_url + 'answers/' + qid,
                            {
                                type: 'GET',
                                dataType: 'json',
                                xhrFields: {withCredentials: true},
                                success: (response) => {
                                    if (response.data != null) {
                                        let answer = response.data;
                                        qdiv.append('<div class="answer" id="aid_' + answer.answer_id + '">' +
                                            answer.answer_text + '</div>');
                                        qdiv.addClass('answered');
                                        qdiv.append('<div class="qbutton"><button class="qedit button">Edit</button><button ' +
                                            'class="qdelete button">Delete</button></div>');
                                    } else {
                                        qdiv.append('<div class="qbox"><input class="qanswerbox"></div>');
                                        qdiv.addClass('unanswered');
                                        qdiv.append('<div class="qbutton"><button class="qsubmit button">Submit</button></div>');
                                    }
                                }
                            });
                    }
                }
            });

        let create_question_div = (question) => {
            let qdiv = $('<div class="question" id="qid_' + question.id + '"></div>');
            qdiv.append('<div class="qtitle">' + question.title + '</div>');
            qdiv.append('<div class="count">' + question.answerCount + '</div>');
            return qdiv;
        }
    }

    function build_RI() {
        let body = $('body');

        body.empty();

        body.html('<nav class="navbar"><button class="navbar-item button" id="home">Home </button><button class="navbar-item button" id="review">' +
            'Review</button><p class="navbar-item" style="margin-left: 5px;">reesb</p><button class="navbar-item button" id="logout">Logout</button></nav><div><h1 ' +
            'class="rev" style="margin-top:20px">Review</h1><p style="text-align: center;">Choose the best response or mark if they are equally co' +
            'rrect.</p></div><hr><div><h3 id="qtitle">--</h3><input id="qa1" name="group" type="radio" value="1"><span>--</span' +
            '><br><input id="qa2" name="group" type="radio" value="2"><span>--</span><br><input id="qa3" name="group" type="ra' +
            'dio" value="0" checked="checked">They are equal.<br><br><button class="button" id="rsubmit">Submit</button><button class="button" id="rskip">Skip</button></div>');

        /*a1button = document.createElement("input");
        a2button = document.createElement("input");;
        equalbutton = document.createElement("input");*/

        $.ajax(root_url + "review",
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    let question = response.data.question.question_title;
                    let a1 = response.data.answer1.text;
                    let a2 = response.data.answer2.text;

                    $("#qtitle").text(question);
                    $("#qtitle").addClass("qid_" + response.data.question.question_id);
                    $("#qa1").next().text(a1);
                    $("#qa1").addClass("aid_" + response.data.answer1.id);
                    $("#qa2").next().text(a2);
                    $("#qa2").addClass("aid_" + response.data.answer2.id);
                }
            });
    }

    function logout() {
        alert("logout");
   }

    $("body").on("click", '#home' ,function () {
        build_QI();
    });

    $("body").on("click", '#review' ,function () {
        build_RI();
    });

    $("body").on("click", '#logout' ,function () {
        //logout
    });

    $("body").on("click", '#rsubmit' ,function () {
        //submit review pair
        qid = document.getElementById("qtitle").classList[0].replace("qid_", "");
        a1id = document.getElementById("qa1").classList[0].replace("aid_", "");
        a2id = document.getElementById("qa2").classList[0].replace("aid_", "");
        if ($("input:radio[name='group']:checked").val() == 1)
            best_aid = a1id;
        else if ($("input:radio[name='group']:checked").val() == 2)
            best_aid = a2id;
        else
            best_aid = 0;

        $.ajax(root_url + "review?qid=" + qid + "&a1=" + a1id + "&a2=" + a2id + "&best=" + best_aid,
            {
                type: 'PUT',
                dataType: 'json',
                /*data: {
                    qid: qid,
                    a1: a1id,
                    a2: a2id,
                    best: best_aid
                },*/
                success: (response) => {
                    build_RI();
                }
            });
    });

    $("body").on("click", '#rskip' ,function () {
        build_RI();
    });



    $("body").on("click", '.qedit', function () {
        if (this.classList.contains("editing")) {

            edittext = this.parentElement.previousSibling.firstChild.value;
            qid = this.parentElement.parentElement.id.replace('qid_', '');
            //url = encodeURI(root_url + "answers/" + qid + "?answer=" + edittext);

            $.ajax(root_url + "answers/" + qid + "?answer=" + edittext,
                {
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    //data: {},
                    success: (response) => {
                        this.classList.remove('editing');
                        this.parentElement.previousSibling.innerText = edittext;
                    },
                    error: () => {
                        alert("Can't edit with no text, use delete instead.");
                    }
                });
        } else {
            let answertext = this.parentElement.previousSibling.innerText;
            this.parentElement.previousSibling.innerText = "";

            let editbox = document.createElement('input');
            editbox.setAttribute("value", answertext);

            this.parentElement.previousSibling.append(editbox);

            this.classList.add("editing");
        }
    });

    $("body").on("click", '.qdelete', function () {
        qid = this.parentElement.parentElement.id.replace('qid_', '');
        $.ajax(root_url + "answers/" + qid,
            {
                type: 'DELETE',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                //data: {},
                success: (response) => {
                    this.parentElement.previousSibling.remove();

                    let qbox = document.createElement("div");
                    let qanswerbox = document.createElement("input");

                    qanswerbox.classList.add("qanswerbox");
                    qbox.classList.add("qbox");
                    qbox.append(qanswerbox);
                    this.parentElement.before(qbox);

                    this.parentElement.parentElement.classList.remove("answered");
                    this.parentElement.parentElement.classList.add('unanswered');

                    let qsubmit = document.createElement("button");
                    qsubmit.classList.add("qsubmit");
                    qsubmit.classList.add("button");
                    qsubmit.innerText = "Submit";
                    this.parentElement.append(qsubmit);
                    this.parentElement.childNodes[0].remove();
                    this.parentElement.childNodes[0].remove();
                }
            });
    });

    $("body").on("click", '.qsubmit', function () {
        submittext = this.parentElement.previousSibling.firstChild.value;
        qid = this.parentElement.parentElement.id.replace('qid_', '');

        $.ajax(root_url + "answers/" + qid + "?answer=" + submittext,
            {
                type: 'PUT',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                //data: {},
                success: (response) => {
                    this.parentElement.previousSibling.remove();

                    let answer = document.createElement("div");
                    answer.innerText = submittext;
                    //let qanswerbox = document.createElement("input");

                    //qanswerbox.classList.add("qanswerbox");
                    answer.classList.add("answer");
                    //qbox.append(qanswerbox);
                    this.parentElement.before(answer);

                    this.parentElement.parentElement.classList.add("answered");
                    this.parentElement.parentElement.classList.remove('unanswered');

                    let qedit = document.createElement("button");
                    let qdelete = document.createElement("button");
                    qedit.classList.add("qedit");
                    qedit.classList.add("button");
                    qdelete.classList.add("qdelete");
                    qdelete.classList.add("button");
                    qedit.innerText = "Edit";
                    qdelete.innerText = "Delete";
                    this.parentElement.append(qedit);
                    this.parentElement.append(qdelete);
                    this.parentElement.childNodes[0].remove();
                }
            });
    });

    $("body").on("click", '.reset', function () {
        $.ajax(root_url + "answers",
            {
                type: 'DELETE',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    build_QI();
                    alert("Deleted all answers.");
                }
            });
    });

    $("body").on("click", '#logout', function () {
        $.ajax(root_url + "logout",
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    build_LI();
                }
            });
    });

    function build_LI() {
        let body = $('body');

        body.empty();

        body.html('<!DOCTYPE html>\n' +
            '<html>\n' +
            '<head>\n' +
            '\t<title>Login</title>\n' +
            '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
            '\t<link rel="stylesheet" type="text/css" href="style.css">\n' +
            '\t<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>\n' +
            '\t<script type="text/javascript" src="script.js"></script>\n' +
            '</head>\n' +
            '<body>\n' +
            '\t<h2 style="margin: 0px">Login</h2>\n' +
            '\t<p style="margin-top: 0px">Enter username and password</p>\n' +
            '\t<input id="user" type="text" value="user"><br>\n' +
            '\t<input id="pass" type="password" value="password"><br>\n' +
            '\t<button class="button" id="login">Login</button>\n' +
            '\t<p id="status">Successfully logged out.</p>\n' +
            '</body>\n' +
            '</html>');
    }

        /********************************************************************************************************************************************************/

        //Create buttons to sort by alphabetical order and answer count by asc and desc order
        $("div.container.header-container").append("<button class=\"button natural alphaSort\">Sort Questions Alphabetically (Asc)</button>");
        $("div.container.header-container").append("<button class=\"button alphaSort\">Sort Questions Alphabetically (Desc)</button>");
        $("div.container.header-container").append("<button class=\"button natural aCountSort\">Sort Questions By Answer Count (Asc)</button>");
        $("div.container.header-container").append("<button class=\"button aCountSort\">Sort Questions By Answer Count (Desc)</button>");
        $("div.container.header-container").append("<input class=\"input\" id=\"searchText\" type=\"text\" placeholder=\"Search question text...\">");

        //Create answered/unanswered question divs (Sort answered and unanswered questions)
        $("div.container.questions-container").append("<div class=\"unanswered-questions\"></div>");
        $("div.container.questions-container").append("<div class=\"answered-questions\"></div>");

        $(".unanswered-questions").append($("form").parent().parent());
        $(".answered-questions").append($(".question-answered-text").parent().parent());

        /* ************************************************************************************ */
        /* Alphabetical Sort                                                                    */
        /* ************************************************************************************ */
        $(".alphaSort").click(function () {
            var qAnsArray = [];
            var qUnansArray = [];

            $.each($(".answered-questions .question"), function (i) {
                qAnsArray[i] = $(this);
            });
            $.each($(".unanswered-questions .question"), function (i) {
                qUnansArray[i] = $(this);
            });
            console.log("enter");
            if ($(this).hasClass("natural")) {
                qAnsArray.sort(function (a, b) {
                    if (a.find(".question-header").text() == b.find(".question-header").text()) {
                        return 0;
                    } else if (a.find(".question-header").text() > b.find(".question-header").text()) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                qUnansArray.sort(function (a, b) {
                    if (a.find(".question-header").text() == b.find(".question-header").text()) {
                        return 0;
                    } else if (a.find(".question-header").text() > b.find(".question-header").text()) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            } else {
                qAnsArray.sort(function (a, b) {
                    if (a.find(".question-header").text() == b.find(".question-header").text()) {
                        return 0;
                    } else if (a.find(".question-header").text() > b.find(".question-header").text()) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                qUnansArray.sort(function (a, b) {
                    if (a.find(".question-header").text() == b.find(".question-header").text()) {
                        return 0;
                    } else if (a.find(".question-header").text() > b.find(".question-header").text()) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }

            $.each(qUnansArray, function (i) {
                $(".unanswered-questions").append(qUnansArray[i]);
            });
            $.each(qAnsArray, function (i) {
                $(".answered-questions").append(qAnsArray[i]);
            });
        });
        /* *********************************************************************************** */
        /* Answer Count Sort                                                                   */
        /* *********************************************************************************** */
        $(".aCountSort").click(function () {
            var qAnsArray = [];
            var qUnansArray = [];

            $.each($(".answered-questions .question"), function (i) {
                qAnsArray[i] = $(this);
            });
            $.each($(".unanswered-questions .question"), function (i) {
                qUnansArray[i] = $(this);
            });

            if ($(this).hasClass("natural")) {
                qAnsArray.sort(function (a, b) {
                    return a.attr("data-answercount") - b.attr("data-answercount");
                });
                qUnansArray.sort(function (a, b) {
                    return a.attr("data-answercount") - b.attr("data-answercount");
                });
            } else {
                qUnansArray.sort(function (a, b) {
                    return b.attr("data-answercount") - a.attr("data-answercount");
                });
                qAnsArray.sort(function (a, b) {
                    return b.attr("data-answercount") - a.attr("data-answercount");
                });
            }


            $(".unanswered-questions .question").detach();
            $(".answered-questions .question").detach();
            $.each(qUnansArray, function (i) {
                $(".unanswered-questions").append(qUnansArray[i]);
            });
            $.each(qAnsArray, function (i) {
                $(".answered-questions").append(qAnsArray[i]);
            });
        });
        /* *********************************************************************************** */
        /* Filter Search                                                                       */
        /* *********************************************************************************** */
        $("#searchText").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".question").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });

        $("div.question-header").append("answercount: ");
        $("div.question-header").each(function () {
            $(this).append($(this).parent().data("answercount"));
        });

        $("div.question-body").append("<button class=\"button hidebutton\" >Show/Hide Question</button>");

        $("button.hidebutton").click(function (e) {
            $(e.currentTarget).prev().toggle();
        });

    });
