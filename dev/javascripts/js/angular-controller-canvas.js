app.controller('canvasController', ['$scope', '$log', 'preloader', function($scope, $log, preloader){

  /**
   * Loads the src derivate of an image asynchroniously in the background
   * @param imgObject - image Object as specified in $scope.content
   */
  $scope.canvasImageLazyPreload = function(imgObject) {
    if (!imgObject.src.loaded && !imgObject.src.loading) {
      imgObject.src.loading = true;
      preloader.preloadImages([imgObject.src.url])
        .then(function(){
          imgObject.src.loaded = true;
          imgObject.src.loading = false;
        });
    }
  };

  /**
   * Returns blurring class if transition is currently active, otherwise no class
   * @returns {*} - CSS class
   */
  $scope.transitionClass = function(){
    if ($scope.appState.transitionActive) {
      return 'app-container_canvas-blur';
    } else {
      return '';
    }
  };

  /**
   * Returns the explanation string of the currently active question
   * @returns {string}
   */
  $scope.currentExplanation = function(){
    return $scope.content[$scope.appState.currentIndex].explanation;
  };

  /**
   * Returns the current content's image object. If the image has not yet
   * been loaded, this method triggers the asynchronious loading in the background
   * @returns imgObject
   */
  $scope.currentImage = function(){
    var appState = $scope.appState;
    var img = null;
    if (appState.view === 'welcome') {
      img = $scope.welcome.img;
    } else if (appState.view === 'goodbye') {
      img = $scope.goodbye.img;
    } else {
      img = $scope.content[appState.currentIndex].img;
    }
    if (!img.src.loaded && !img.src.loading) {
      $scope.canvasImageLazyPreload(img);
    }
    return img;
  };

  /**
   * Method for pseudo encryption. Shuffles chars in a string randomly while preserving
   * the string's visual appearance. Uppercase letters will be replaced by a random
   * uppercase letter, lowercase by lowercase, symbols by symbols. Frequently used
   * interpunction chars like comma and fullstop are kept.
   * @param plainString - string to be shuffled
   * @returns {string} - shuffled string
   */
  $scope.encryptString = function (plainString) {
    var possibleChars =
      'aáàâbcdeéèêfghiíìîjklmnoóòôpqrstuúùûvwxyzäöüß'+
      'AÁÀBCDEÉÈÊFGHIÍÌÎJKLMNOÓÒÔPQRSTUÚÙÛVWXYZÄÖÜ'+
      '1234567890§$%&="\'#+*¡¢[]|{}¿';
    var lowercaseChars = 'aáàâbcdeéèêghiíìîjklmnoóòôpqrstuúùûvwxyzäöüß';
    var lowercaseThinChars = 'fiíìîjlt';
    var lowercaseWideChars = 'aáàâbcdeéèêghkmnoóòôpqrsuúùûvwxyzäöüß';
    var uppercaseChars = 'AÁÀBCDEÉÈÊFGHIÍÌÎJKLMNOÓÒÔPQRSTUÚÙÛVWXYZÄÖÜ1234567890';
    var uppercaseThinChars = 'IÍÌÎJL';
    var uppercaseWideChars = 'AÁÀBCDEÉÈÊFGHKMNOÓÒÔPQRSTUÚÙÛVWXYZÄÖÜ1234567890';
    var symbolChars = '§$%&="\'#+*¡¢[]|{}¿';
    var interpunctionChars = ',.-;:_()/?!_';
    var whitespaceSeparated = plainString.split(' ');
    var whitespaceSeparatedEncrypted = [];
    var encryptedString = '';

    // Word for word
    $.each(whitespaceSeparated, function(i,v){

      whitespaceSeparatedEncrypted[i] = '';

      // Char for char
      for (var j=0; j<v.length; j++) {
        var char = v[j];
        var cryptchar;

        // If interpunction char: keep it
        if (interpunctionChars.indexOf(char) >= 0) {
          cryptchar = char;
        // Otherwise encrypt it
        } else if (lowercaseChars.indexOf(char) >= 0) {
          // Distinguish between thin chars ('f', 'i'-ish, 'j', 'l' and 't') and wide chars
          if (lowercaseThinChars.indexOf(char) >= 0) {
            cryptchar = lowercaseThinChars[Math.floor(Math.random() * lowercaseThinChars.length)];
          } else {
            cryptchar = lowercaseWideChars[Math.floor(Math.random() * lowercaseWideChars.length)];
          }
        } else if (uppercaseChars.indexOf(char) >= 0) {
          // Distinguish between thin chars ('I'-ish, 'J' and 'L') and wide chars
          if (uppercaseThinChars.indexOf(char) >= 0) {
            cryptchar = uppercaseThinChars[Math.floor(Math.random() * uppercaseThinChars.length)];
          } else {
            cryptchar = uppercaseWideChars[Math.floor(Math.random() * uppercaseWideChars.length)];
          }
        } else if (symbolChars.indexOf(char) >= 0) {
          cryptchar = symbolChars[Math.floor(Math.random() * symbolChars.length)];
        } else {
          cryptchar = possibleChars[Math.floor(Math.random() * possibleChars.length)];
        }
        whitespaceSeparatedEncrypted[i] += cryptchar;
      }
    });

    // Assemble encrypted string from words
    for (var k=0; k<whitespaceSeparatedEncrypted.length; k++) {
      encryptedString += whitespaceSeparatedEncrypted[k];
      encryptedString += (k < whitespaceSeparatedEncrypted.length-1) ? ' ' : '';
    }

    return encryptedString;
  };

  /**
   * Returns an object containing meta information about the image. If appState is
   * 'question', returns randomly generated strings that resemble the true meta
   * information visually. This is because meta information can contain hints that
   * spoil the correct answer to the user.
   * @returns {*} - image meta object
   */
  $scope.currentImageMeta = function(){
    var currentImage = $scope.currentImage();
    if ($scope.appState.view === 'question') {
      if (!currentImage.metaEncrypted) {
        currentImage['metaEncrypted'] = {
          'caption': $scope.encryptString(currentImage.meta.caption),
          'credit': $scope.encryptString(currentImage.meta.credit),
          'captionCssClass': 'cvs-imageBlock_imageCaption-blurred',
          'creditCssClass': 'cvs-imageBlock_imageCredit-blurred',
        };
      }
      return currentImage.metaEncrypted;
    } else {
      return currentImage.meta;
    }
  };

  /**
   * Returns the appropriate label for the advance button in answer view:
   * If current question is the last, returns 'Zur Auswertung', otherwise 'Weiter'.
   * @returns {string}
   */
  $scope.currentAdvanceLabel = function () {
    return ($scope.appState.currentIndex === $scope.content.length - 1) ? 'Zur Auswertung' : 'Weiter';
  };

  /**
   * Returns the active question string.
   * @returns {string}
   */
  $scope.currentQuestion = function(){
    return $scope.content[$scope.appState.currentIndex].question;
  };

  /**
   * Sets an answer for the current question and advances to the next step in the game.
   * @param answerGiven - must be boolean
   */
  $scope.answer = function (answerGiven) {
    if (typeof answerGiven !== 'boolean') {
      $log.error('Error in canvasController.answer(): anserGiven must be of type boolean');
      return;
    }
    if ($scope.appState.view !== 'question') {
      $log.error('Error in canvasController.answer(): method can only be called in question view');
      return;
    }
    var appState = $scope.appState;
    var currentContent = $scope.content[appState.currentIndex];
    currentContent.answered = true;
    currentContent.answerGiven = answerGiven;
    if (currentContent.answerGiven === currentContent.isAllgaeu) {
      appState.answersCorrect += 1;
    }
    appState.view = 'answer';
  };

}]);