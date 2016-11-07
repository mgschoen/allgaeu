// Init angular app with root scope
var app = angular.module('allgaeu', ['ngSanitize']);

app.controller('mainController', [ '$scope', '$log', function($scope, $log){

  /** * * * * * * * * * * * *
   *  Global app variables  *
   * * * * * * * * * * * * **/

  // Information about the current state of the app
  $scope.appState = {
    'answersCorrect': 0,
    'currentIndex':   0,
    // Valid views are [ 'welcome', 'question', 'answer', 'goodbye' ]
    'view':           'welcome'
  };

  // Information about the images and answers of the quiz
  $scope.content = [
    {
      'answered':    false,
      'answerGiven': null,
      'explanation': '<p>Hier kommt eine kurze Erklärung des Bildes in HTML-Form. Dieses Bild ist definitv <b>not Allgäu</b>.</p>',
      'img': {
        'caption':   'Lorem ipsum dolor sit amet',
        'credit':    'Julia Buchmaier',
        'src':       '/images/q1.jpg',
        'thumb':     '/images/q1.jpg'
      },
      'isAllgaeu':   false,
      'question':    '<p>Ein erster Versuch: Wurde dieses Bild im Allgäu gemacht oder nicht?</p>',
      'sortIndex':   0
    },
    {
      'answered':    false,
      'answerGiven': null,
      'explanation': '<p>Das ist ein Test mit einem zweiten Content.</p>',
      'img': {
        'caption':   'Lorem ipsum dolor sit amet',
        'credit':    'Julia Buchmaier',
        'src':       '/images/q2.jpg',
        'thumb':     '/images/q2.jpg'
      },
      'isAllgaeu':   false,
      'question':    '<p>Ein zweiter Versuch: Wurde dieses Bild im Allgäu gemacht oder nicht?</p>',
      'sortIndex':   1
    },
    {
      'answered':    false,
      'answerGiven': null,
      'explanation': '<p>This picture was SHOT by the author.</p>',
      'img': {
        'caption':   'Lorem ipsum dolor sit amet',
        'credit':    'Mike Milligan',
        'src':       '/images/q3.jpg',
        'thumb':     '/images/q3.jpg'
      },
      'isAllgaeu':   false,
      'question':    '<p>Ein dritter Versuch: Wurde dieses Bild im Allgäu gemacht oder nicht?</p>',
      'sortIndex':   2
    }
  ];

  // Information about the goodbye page
  $scope.goodbye = {
    'img': {
      'caption':   'Definitiv Allgäu: Viehscheid in Bad Hindelang.',
      'credit':    'Flodur63 / Wikimedia Commons',
      'src':       '/images/welcome.JPG'
    }
  };

  // Information about the welcome page
  $scope.welcome = {
    'img': {
      'caption':   'Definitiv Allgäu: Viehscheid in Bad Hindelang.',
      'credit':    'Flodur63 / Wikimedia Commons',
      'src':       '/images/welcome.JPG'
    },
    'text':      '<p>Grüne Hügel, braunes Vieh, massive Berge, hölzerne Hütten - Dinge, ' +
    'die der gemeine Allgäuer mit seiner Heimat verbindet. Dann reist er durch die Welt und ihm ' +
    'schwirrt der Kopf: Es sieht ja überall so aus wie zu Hause!</p><p>Glaubst du nicht? Dann sieh ' +
    'dir diese Bilder an und sag uns: Stammen diese Bilder aus dem Allgäu - oder nicht?</p>'
  };

  /** * * * * * * * * * * *
   *  Global app methods  *
   * * * * * * * * * * * **/

  /**
   * Advances the app to the next step in the natural app flow
   * */
  $scope.advance = function(){
    if ($scope.appState.view === 'welcome') {
      $scope.appState.view = 'question';
    } else if ($scope.appState.view === 'answer') {
      var appState = $scope.appState;
      var questionsTotal = $scope.content.length;
      if (appState.currentIndex < questionsTotal - 1) {
        $scope.goToQuestion(appState.currentIndex + 1);
      } else {
        appState.view = 'goodbye';
      }
    }
  };

  /**
   * Returns true if correct answer and given answer match, otherwise false
   * */
  $scope.currentAnswerCorrect = function(){
    var currentContent = $scope.content[$scope.appState.currentIndex];
    if (currentContent.isAllgaeu === currentContent.answerGiven) {
      return true;
    }
    return false;
  };

  /**
   * Jumps to a specified question with regard to whether that question has already been
   * answered or not.
   * */
  $scope.goToQuestion = function (index) {
    if (typeof index !== 'number') {
      $log.error('Error in mainController.goToQuestion(): index must be of type number');
      return;
    }
    if (index < 0 || index >= $scope.content.length) {
      $log.error('Error in mainController.goToQuestion(): index out of bounds');
      return;
    }
    if (index !== $scope.appState.currentIndex) {
      $scope.appState.currentIndex = index;
      $scope.appState.view = ($scope.content[index].answered) ? 'answer' : 'question';
    }
  };

  /**
   * Jumps to the next question if one exists
   * */
  $scope.nextQuestion = function () {
    var currentIndex = $scope.appState.currentIndex;
    if (currentIndex < ($scope.content.length - 1)) {
      $scope.goToQuestion(currentIndex + 1);
    }
  };

  /**
   * Jumps to the previous question if one exist
   * */
  $scope.previousQuestion = function () {
    var currentIndex = $scope.appState.currentIndex;
    if (currentIndex > 0) {
      $scope.goToQuestion(currentIndex - 1);
    }
  };

}]);