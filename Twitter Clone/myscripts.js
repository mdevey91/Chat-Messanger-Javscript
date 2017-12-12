var cnt_max = 5;
var config = {
  //apiKey: "AIzaSyBDgHk3_m-vqyUbTGIqgCZ8qAb-CoY5ID4",
  authDomain: "luminous-torch-6850.firebaseapp.com",
  databaseURL: "https://luminous-torch-6850.firebaseio.com",
  storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(config);
var chattyref = firebase.database().ref('chatty/');

function addTweet() {
  var newTweetRef = chattyref.push();
  var sender = $("#sender").val();
  var message = $("#message").val();
  var timeStamp = new Date();
  if (sender === '')
    sender = 'Anonymous';
  if (message === '')
    message = '(no message)';
  timeStamp = timeStamp.toString();
  var inReplyTo = null; // Figure out the best way to do this
  newTweetRef.set({
    'message': message,
    'sender': sender,
    'timeStamp': timeStamp,
    'inReplyTo': inReplyTo
  });
}

function update_tweetlist() {
  var cnt = 0;
  $(".tweet").each(function () {
    cnt++;
    if (cnt <= cnt_max) {
      $(this).slideDown();
    } else {
      $(this).slideUp();
    }
  });
}

function startTweetListener() {
  chattyref.on('child_added', function (tweet) {
    var message = tweet.val().message;
    var sender = tweet.val().sender;
    var key = tweet.key;
    var time = tweet.val().timeStamp;
    $("#tweetlist").prepend(
      '<div id="' + key + '" class="tweet">' +
      '<button type="button" id="del' + key + '" class="col-md-1 col-md-offset-11 delete_button btn btn-default"><span class="glyphicon glyphicon-trash"></span></button>' +
      "Sender: " +
      sender +
      "<br>Message: " +
      message +
      "<br>Date: " +
      time +
      '</div>'
    );
    update_tweetlist();
    //  add handler for adding functionality to the delete button. i.e.
    $("#del" + key).click(function () {
      $("#" + key).remove();
      chattyref.child(key).remove();
      update_tweetlist();
    });
  });
  chattyref.on('child_removed', function (tweet) {
    $("#" + tweet.key).addClass('redback');
    $("#" + tweet.key).slideUp(function () {
      $("#" + tweet.key).remove();
      update_tweetlist();
    });
  });
}

$(document).ready(function () {

  startTweetListener();
  $(".submitTweet").click(function () {
    addTweet();
  });

  $("#increaseCount").click(function () {
    cnt_max++;
    update_tweetlist();
  });

  $("#decreaseCount").click(function () {
    cnt_max--;
    update_tweetlist();
  });
});