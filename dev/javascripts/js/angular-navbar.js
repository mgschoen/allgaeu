app.controller('navbarController', [ '$scope', '$log', function($scope, $log){

  /**
   * Callback firing when the 'changed.owl.carousel' event was detected on the carousel.
   * Not to be called outside the event handler.
   * @param event JS event object
   */
  $scope.carouselChanged = function (event) {
    var carouselIndex = event.item.index;
    if ($scope.appState.currentIndex !== carouselIndex) {
      $scope.$apply(function(){
        $scope.goToQuestion(carouselIndex);
      });
    }
  };

  /**
   * Checks whether there is enough space for the navbar to be unfolded without hiding
   * any content. If so, unfolds it.
   * */
  $scope.unfoldNavbarIfPossible = function(){
    var canvasHeight = $(".app-container")[0].offsetHeight;
    var canvasMarginTop = parseInt($(".app-container").css("margin-top").split("px")[0]);
    var viewportHeight = window.innerHeight;
    var navbarHeight = $(".nvg")[0].offsetHeight + $(".nvg-counter")[0].offsetHeight;
    if (viewportHeight - (canvasHeight + canvasMarginTop) > navbarHeight) {
      $(".nvg").addClass("nvg-unfold");
    } else {
      $(".nvg").removeClass("nvg-unfold");
    }
  };

  $scope.toggleNavbarUnfolding = function () {
    $(".nvg").toggleClass("nvg-unfold");
  };

  $scope.unfoldNavbar = function () {
    $(".nvg").addClass("nvg-unfold");
  };

  /**
   * Initialize the owl-carousel plugin
   * */
  $($scope).ready(function(){

    $scope.carousel = $("#navcarousel").owlCarousel({
      center: true,
      items: 13,
      margin: 20,
      responsive: {
        0: {
          items: 1
        },
        320: {
          items: 3
        },
        768: {
          items: 5
        },
        992: {
          items: 7
        },
        1170: {
          items: 9
        }
      }
    });

    $scope.unfoldNavbarIfPossible();

    // On every change of appState.currentIndex, move the carousel to the new position
    $scope.$watch('appState.currentIndex', function(){
      $scope.carousel.trigger('to.owl.carousel', [$scope.appState.currentIndex]);
    });

    // On every change in the owl carousel
    $(document).on('changed.owl.carousel', $scope.carousel, $scope.carouselChanged);

    // On every window resize check if the navbar still fits without occluding content
    $(window).resize($scope.unfoldNavbarIfPossible);

    // On every scroll hide the navbar
    $(document).on("scroll", function(){
      $(".nvg").removeClass("nvg-unfold");
    });

    $(".owl-item").on("click touch", function(){
      var index = $(this).index();
      $(".nvg-imgList_item.selected").removeClass("selected").addClass("unselected");
      $(this).find(".nvg-imgList_item").removeClass("unselected").addClass("selected");
      $scope.carousel.trigger("to.owl.carousel", index);
    });

  });

}]);
