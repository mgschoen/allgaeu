// Determine whether navbar would occlude canvas.
// If not: Show it!
function unfoldNavbarIfPossible () {
  var canvasHeight = $("section.quizpage")[0].offsetHeight;
  var canvasMarginTop = parseInt($(".app-container").css("margin-top").split("px")[0]);
  var viewportHeight = window.innerHeight;
  var navbarHeight = $(".nvg")[0].offsetHeight + $(".nvg-counter")[0].offsetHeight;
  if (viewportHeight - (canvasHeight + canvasMarginTop) > navbarHeight) {
    $(".nvg").addClass("nvg-unfold");
  } else {
    $(".nvg").removeClass("nvg-unfold");
  }
}

$(function(){

  var carousel = $("#navcarousel").owlCarousel({
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
    },
    startPosition: 2
  });

  unfoldNavbarIfPossible();

  $(window).resize(unfoldNavbarIfPossible);

  $(document).on("scroll", function(){
    $(".nvg").removeClass("nvg-unfold");
  });

  $(".nvg-counter").on("click touchstart",function(){
    $(".nvg").toggleClass("nvg-unfold");
  })
    .on("mouseover", function(){
      $(".nvg").addClass("nvg-unfold");
    });

  $(".nvg-directions_arrow-left").on("click touch", function(){
    carousel.trigger("prev.owl.carousel");
  });

  $(".nvg-directions_arrow-right").on("click touch", function(){
    carousel.trigger("next.owl.carousel");
  });

  $(".owl-item").on("click touch", function(){
    var index = $(this).index();
    $(".nvg-imgList_item.selected").removeClass("selected").addClass("unselected");
    $(this).find(".nvg-imgList_item").removeClass("unselected").addClass("selected");
    carousel.trigger("to.owl.carousel", index);
  });

  $(window).on("resize orientationChange", function(){

  });

});