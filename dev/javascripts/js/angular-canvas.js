app.controller('canvasController', [ '$scope', function($scope){

  $scope.currentExplanation = function(){
    return $scope.content[$scope.appState.currentIndex].explanation;
  };

  $scope.currentImage = function(){
    var appState = $scope.appState;
    if (appState.view === 'welcome') {
      return $scope.welcome.img;
    } else if (appState.view === 'goodbye') {
      return $scope.goodbye.img;
    } else {
      return $scope.content[appState.currentIndex].img;
    }
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