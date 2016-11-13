app.controller('navbarController', [ '$scope', '$log', 'preloader', function($scope, $log, preloader){

  /**
   * Loads the thumb derivate of an image asynchroniously in the background
   * @param imgObject - image Object as specified in $scope.content
   */
  $scope.navbarImageLazyPreload = function(imgObject) {
    if (!imgObject.thumb.loaded && !imgObject.thumb.loading) {
      imgObject.thumb.loading = true;
      preloader.preloadImages([imgObject.thumb.url])
        .then(function(){
          imgObject.thumb.loaded = true;
          imgObject.thumb.loading = false;
          $scope.appState.imagesLoading -= 1;
        });
    }
  };

  /**
   * Callback firing when the 'changed.owl.carousel' event was detected on the carousel.
   * Not to be called outside the event handler.
   * @param event - JS event object
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
   * Callback firing when a click event occurs on an .owl-item. Not to be called outside
   * the event handler.
   * @param event - JS event object
   */
  $scope.carouselItemClicked = function (event) {
    var targetElement = $(event.target.closest('.owl-item'));
    var index = targetElement.index();
    $(".nvg-imgList_item.selected").removeClass("selected").addClass("unselected");
    targetElement.find(".nvg-imgList_item").removeClass("unselected").addClass("selected");
    $scope.carousel.trigger("to.owl.carousel", index);
  };

  $scope.toggleNavbarUnfolding = function () {
    $(".nvg").toggleClass("nvg-unfold");
  };

  $scope.unfoldNavbar = function () {
    $(".nvg").addClass("nvg-unfold");
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

  /**
   * Watch for changes in appState.navbarEnabled flag
   */
  $scope.$watch('appState.navbarEnabled', function(){
    if ($scope.appState.navbarEnabled) {
      for (var i=0; i<$scope.content.length; i++) {
        $scope.navbarImageLazyPreload($scope.content[i].img);
      }
    }
  });

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

    // On every change of appState.currentIndex move the carousel to the new position
    $scope.$watch('appState.currentIndex', function(){
      $scope.carousel.trigger('to.owl.carousel', [$scope.appState.currentIndex]);
    });

    // On every change in the carousel call the navbarController.carouselChanged() method
    $(document).on('changed.owl.carousel', $scope.carousel, $scope.carouselChanged);

    // On every click on a carousel item jump to that item
    $(document).on('click', '.owl-item', $scope.carouselItemClicked);

    // On every window resize check if the navbar still fits without occluding content
    $(window).resize($scope.unfoldNavbarIfPossible);

    // On every scroll hide the navbar
    $(document).on("scroll", function(){
      $(".nvg").removeClass("nvg-unfold");
    });

  });

}]);
