"use strict";

var _experiment = _interopRequireDefault(require("./experiment.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', function () {
  var element = document.createElement('div');
  expect(element).not.toBeNull();
});
describe('Experiment Timeline', function () {
  it('should be an array', function () {
    expect(Array.isArray(_experiment["default"])).toBe(true);
  });
  it('should contain at least one trial', function () {
    expect(_experiment["default"].length).toBeGreaterThan(0);
  });
  it('should have the correct structure for the hello world trial', function () {
    var helloWorldTrial = _experiment["default"][0]; // Assuming the hello world trial is the first one
    expect(helloWorldTrial).toHaveProperty('type', 'html-keyboard-response');
    expect(helloWorldTrial).toHaveProperty('stimulus', 'Hello world!');
  });
});

// The exported timeline is indeed an array.
// The timeline contains at least one trial.
// The first trial in the timeline is a "Hello world!" trial of the type 'html-keyboard-response'.