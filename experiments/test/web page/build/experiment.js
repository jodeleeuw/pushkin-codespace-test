"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeline = createTimeline;
var _pluginHtmlKeyboardResponse = _interopRequireDefault(require("@jspsych/plugin-html-keyboard-response"));
var _config = _interopRequireDefault(require("./config"));
var _consent = _interopRequireDefault(require("./consent"));
var _stim = _interopRequireDefault(require("./stim"));
var _debrief = _interopRequireDefault(require("./debrief"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function createTimeline(jsPsych) {
  // Construct the timeline inside this function just as you would in jsPsych v7.x
  var timeline = [];

  // Resize the jsPsychTarget div
  // This will help later with centering the fixation cross relative to other content
  var resizejsPsychTarget = function resizejsPsychTarget(divHeight) {
    var jsPsychTarget = document.getElementById('jsPsychTarget');
    jsPsychTarget.style.height = divHeight + 'px';
  };
  // Set the height of the jsPsychTarget div to half the height of the browser window
  // You can play with the multiplier according to the needs of your experiment
  resizejsPsychTarget(window.innerHeight * 0.5);

  // A welcome page that displays the consent text from consent.js
  var welcome = {
    type: _pluginHtmlKeyboardResponse["default"],
    stimulus: _consent["default"] + '<p>Press spacebar to continue.</p>',
    choices: [' ']
  };
  timeline.push(welcome);

  // The first page of instructions
  var instructions_1 = {
    type: _pluginHtmlKeyboardResponse["default"],
    stimulus: "\n          <p>You will see two sets of letters displayed in a box, like this:</p>\n          <div class=\"fixation\"><p class=\"top\">HELLO</p><p class=\"bottom\">WORLD</p></div>\n          <p>Press Y if both sets are valid English words. Press N if one or both is not a word.</p>\n          <p>Press Y to continue.</p>\n        ",
    choices: ['y']
  };
  timeline.push(instructions_1);

  // The second page of instructions
  var instructions_2 = {
    type: _pluginHtmlKeyboardResponse["default"],
    stimulus: "\n          <p>In this case, you would press N.</p>\n          <div class=\"fixation\"><p class=\"top\">FOOB</p><p class=\"bottom\">ARTIST</p></div>\n          <p>Press N to begin the experiment.</p>\n        ",
    choices: ['n']
  };
  timeline.push(instructions_2);
  var lexical_decision_procedure = {
    timeline: [
    // Display the box for 1000 ms before the words appear
    {
      type: _pluginHtmlKeyboardResponse["default"],
      stimulus: '<div class="fixation"></div>',
      // See ./assets/experiment.css
      choices: 'NO_KEYS',
      trial_duration: 1000
    },
    // Display the words and wait for a keyboard response
    {
      type: _pluginHtmlKeyboardResponse["default"],
      stimulus: function stimulus() {
        var first_word = jsPsych.timelineVariable('word_1');
        var second_word = jsPsych.timelineVariable('word_2');
        first_word = '<div class="fixation"><p class="top">' + first_word + '</p>';
        second_word = '<p class="bottom">' + second_word + '</p></div>';
        return first_word + second_word;
      },
      choices: ['y', 'n'],
      data: {
        both_words: jsPsych.timelineVariable('both_words'),
        related: jsPsych.timelineVariable('related')
      },
      // Check whether the response was correct
      on_finish: function on_finish(data) {
        if (data.both_words) {
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, 'y');
        } else {
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, 'n');
        }
      }
    },
    // Provide feedback if experimentConfig.correctiveFeedback is set to true in config.js
    {
      type: _pluginHtmlKeyboardResponse["default"],
      stimulus: function stimulus() {
        // Change the color of the box if feedback is enabled
        if (_config["default"].correctiveFeedback) {
          var last_correct = jsPsych.data.getLastTrialData().values()[0].correct;
          if (last_correct) {
            return '<div class="fixation correct"></div>';
          } else {
            return '<div class="fixation incorrect"></div>';
          }
        } else {
          return '<div class="fixation"></div>';
        }
      },
      choices: 'NO_KEYS',
      trial_duration: 2000
    }],
    timeline_variables: _stim["default"],
    randomize_order: true
  };
  timeline.push(lexical_decision_procedure);

  // A final feedback and debrief page
  var data_summary = {
    type: _pluginHtmlKeyboardResponse["default"],
    stimulus: function stimulus() {
      // Calculate task performance
      var correct_related = jsPsych.data.get().filter({
        related: true,
        correct: true
      }).count();
      var total_related = jsPsych.data.get().filter({
        related: true
      }).count();
      var mean_rt_related = jsPsych.data.get().filter({
        related: true,
        correct: true
      }).select('rt').mean();
      var correct_unrelated = jsPsych.data.get().filter({
        related: false,
        both_words: true,
        correct: true
      }).count();
      var total_unrelated = jsPsych.data.get().filter({
        related: false,
        both_words: true
      }).count();
      var mean_rt_unrelated = jsPsych.data.get().filter({
        related: false,
        both_words: true,
        correct: true
      }).select('rt').mean();

      // Show results and debrief from debrief.js
      var results = "\n                <p>You were correct on ".concat(correct_related, " of ").concat(total_related, " related word pairings!\n                Your average correct response time for these was ").concat(Math.round(mean_rt_related), " milliseconds.</p>\n                <p>For unrelated word pairings, you were correct on ").concat(correct_unrelated, " of ").concat(total_unrelated, "!\n                Your average correct response time for these was ").concat(Math.round(mean_rt_unrelated), " milliseconds.</p>\n            ");
      return results + _debrief["default"] + '<p>Press spacebar to finish.</p>';
    },
    choices: [' ']
  };
  timeline.push(data_summary);
  return timeline;
}