app.controller('mainController', [ '$scope', '$log', '$timeout', function($scope, $log, $timeout){

  /** * * * * * * * * * * * *
   *  Global app variables  *
   * * * * * * * * * * * * **/

  // Information about the current state of the app
  $scope.appState = {
    'answersCorrect':     0,
    'currentIndex':       0,
    'fontsLoaded':        false,
    'navbarEnabled':      false,
    'transitionActive':   false,
    'view':               'welcome' // Valid views are [ 'welcome', 'question', 'answer', 'goodbye' ]
  };

  // Information about the images and answers of the quiz
  $scope.content = [
    {
      'answered':    false,
      'answerGiven': null,
      'explanation': '<p>Hier kommt eine kurze Erklärung des Bildes in HTML-Form. Dieses Bild ist definitv <b>not Allgäu</b>.</p>',
      'img': {
        'meta': {
          'caption':   'Von wegen Allgäu: Das hier ist firgendwo aus den U-S-A!',
          'credit':    'Julia Buchmaier',
        },
        'src': {
          'loaded':  false,
          'loading': false,
          'url':     '/images/q1.jpg?cache=' + ( new Date() ).getTime()
        },
        'thumb': {
          'loaded':  false,
          'loading': false,
          'url':     '/images/q1_thumb.jpg?cache=' + ( new Date() ).getTime()
        }
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
        'meta': {
          'caption':   'Allgäu? Wer\'s glaubt wird selig! Wieder sind wir in Amerika.',
          'credit':    'Julia Buchmaier',
        },
        'src': {
          'loaded':  false,
          'loading': false,
          'url':     '/images/q2.jpg?cache=' + ( new Date() ).getTime()
        },
        'thumb': {
          'loaded':  false,
          'loading': false,
          'url':     '/images/q2_thumb.jpg?cache=' + ( new Date() ).getTime()
        }
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
        'meta': {
          'caption':   'Lorem ipsum dolor sit amet',
          'credit':    'Mike Milligan',
        },
        'src': {
          'loaded':  false,
          'loading': false,
          'url':     '/images/q3.jpg?cache=' + ( new Date() ).getTime()
        },
        'thumb': {
          'loaded':  false,
          'loading': false,
          'url':     '/images/q3_thumb.jpg?cache=' + ( new Date() ).getTime()
        }
      },
      'isAllgaeu':   false,
      'question':    '<p>Ein dritter Versuch: Wurde dieses Bild im Allgäu gemacht oder nicht?</p>',
      'sortIndex':   2
    }
  ];

  // Information about the goodbye page
  $scope.goodbye = {
    'img': {
      'meta': {
        'caption':   'Definitiv Allgäu: Viehscheid in Bad Hindelang.',
        'credit':    'Flodur63 / Wikimedia Commons',
      },
      'src': {
        'loaded':  false,
        'loading': false,
        'url':     '/images/welcome.JPG?cache=' + ( new Date() ).getTime()
      }
    }
  };

  // Information about the welcome page
  $scope.welcome = {
    'img': {
      'meta': {
        'caption':   'Definitiv Allgäu: Viehscheid in Bad Hindelang.',
        'credit':    'Flodur63 / Wikimedia Commons',
      },
      'src': {
        'loaded':  false,
        'loading': false,
        'url':     '/images/welcome.JPG?cache=' + ( new Date() ).getTime()
      }
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
    var view = $scope.appState.view;
    var currentIndex = $scope.appState.currentIndex;
    var questionsTotal = $scope.content.length;

    // If in welcome view go to first question view
    if (view === 'welcome') {
      $scope.appState.transitionActive = true;
      $timeout(function(){
        $scope.appState.view = 'question';
        $scope.appState.navbarEnabled = true;
        $scope.appState.transitionActive = false;
      }, 300);

    // In last answer view check if all questions have been answered.
    } else if (view === 'answer' && currentIndex === questionsTotal - 1) {
      var firstNotAnsweredIndex = -1;
      for (var i=0; i<$scope.content.length; i++) {
        if (!$scope.content[i].answered) {
          firstNotAnsweredIndex = i;
          break;
        }
      }

      // If there are unanswered questions prompt the user. If answer is 'Cancel' go
      // to first question that was not answered. If answer is 'OK' go to goodbye page.
      if (firstNotAnsweredIndex > -1 &&
        !window.confirm('Du hast noch nicht alle Fragen beantwortet. Wirklich fortfahren?')) {
        $scope.goToQuestion(firstNotAnsweredIndex);
      } else {
        $scope.appState.transitionActive = true;
        $timeout(function() {
          $scope.appState.view = 'goodbye';
          $scope.appState.navbarEnabled = false;
          $scope.appState.transitionActive = false;
        }, 300);
      }

    // In regular answer view go to next question view
    } else if (view === 'answer') {
      $scope.goToQuestion(currentIndex + 1);
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
      $scope.appState.transitionActive = true;
      $timeout(function(){
        $scope.appState.currentIndex = index;
        $scope.appState.view = ($scope.content[index].answered) ? 'answer' : 'question';
        $scope.appState.transitionActive = false;
      }, 300);
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

  /**
   * Restarts the game by setting all game logic related values to default
   * */
  $scope.resetGame = function () {
    $scope.appState.transitionActive = true;
    $timeout(function(){
      $scope.appState.view = 'welcome';
      $scope.appState.currentIndex = 0;
      $scope.appState.answersCorrect = 0;
      for (var i=0; i<$scope.content.length; i++) {
        $scope.content[i].answered = false;
        $scope.content[i].answerGiven = null;
      }
      $scope.appState.transitionActive = false;
    }, 300);
  };

  /**
   * Trigger webfont loader
   */
  console.log(WebFont.load);
  WebFont.load({
    google: {
      families: ['Jaldi:400,700', 'Walter Turncoat']
    },
    /** Load success */
    active: function(){
      $scope.$apply(function(){
        $scope.appState.fontsLoaded = true;
      });
    }
  });

}]);