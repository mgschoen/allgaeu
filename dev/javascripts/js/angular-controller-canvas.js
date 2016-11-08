app.controller('canvasController', ['$scope', '$log', 'preloader', function($scope, $log, preloader){

  $scope.canvasImageLazyPreload = function(imgObject) {
    if (!imgObject.src.loaded && !imgObject.src.loading) {
      $log.log('Loading ' + imgObject.src.url + '...');
      imgObject.src.loading = true;
      preloader.preloadImages([imgObject.src.url])
        .then(function(){
          imgObject.src.loaded = true;
          imgObject.src.loading = false;
          $log.log('Done loading ' + imgObject.src.url);
        });
    }
  };

  $scope.currentExplanation = function(){
    return $scope.content[$scope.appState.currentIndex].explanation;
  };

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

  $scope.currentAdvanceLabel = function () {
    return ($scope.appState.currentIndex === $scope.content.length - 1) ? 'Zur Auswertung' : 'Weiter';
  };

  $scope.currentQuestion = function(){
    return $scope.content[$scope.appState.currentIndex].question;
  };

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