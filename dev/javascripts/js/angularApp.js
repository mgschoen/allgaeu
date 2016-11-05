// Init angular app with root scope
var app = angular.module('allgaeu', []);

/**
 *  Define global scope variables
 *  */
app.run(['$rootScope', function($rootScope){

  // Information about the current state of the app
  $rootScope.appState = {
    'answersCorrect': 0,
    'currentIndex':   0,
    // Valid views are [ 'welcome', 'question', 'answer', 'goodbye' ]
    'view':           'question'
  };

  // Information about the images and answers of the quiz
  $rootScope.content = [
    {
      'answered':    false,
      'answerGiven': null,
      'explanation': '<p>Hier kommt eine kurze Erklärung des Bildes in HTML-Form.</p>',
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
      'sortIndex':   0
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
      'sortIndex':   0
    }
  ];

  // Information about the goodbye page
  $rootScope.goodbye = {
    'img': {
      'caption':   'Definitiv Allgäu: Viehscheid in Bad Hindelang.',
      'credit':    'Flodur63 / Wikimedia Commons',
      'src':       '/images/welcome.JPG'
    }
  };

  // Information about the welcome page
  $rootScope.welcome = {
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


}]);

app.controller('canvasController', [ '$scope', '$rootScope' , function($scope, $rootScope){

}]);

app.controller('navbarController', [ '$scope', '$rootScope' , function($scope, $rootScope){

}]);
