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

  $(".nvg-directions_arrow-left").click(function(){
    carousel.trigger("prev.owl.carousel");
  });

  $(".nvg-directions_arrow-right").click(function(){
    carousel.trigger("next.owl.carousel");
  });

  $(".owl-item").click(function(){
    var index = $(this).index();
    $(".nvg-imgList_item.selected").removeClass("selected").addClass("unselected");
    $(this).find(".nvg-imgList_item").removeClass("unselected").addClass("selected");
    carousel.trigger("to.owl.carousel", index);
  });

  $(window).on("resize orientationChange", function(){

  });

});