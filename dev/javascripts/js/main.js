$(function(){

  var carouselMarkup = $("#navcarousel");
  var selectedIndex = carouselMarkup.find(".selected").index();

  var carousel = $("#navcarousel").owlCarousel({
    center: true,
    nav: false,
    startPosition: selectedIndex
  });

  $(".nvg-directions_arrow-left").click(function(){
    carousel.trigger("prev.owl.carousel");
  });

  $(".nvg-directions_arrow-right").click(function(){
    carousel.trigger("next.owl.carousel");
  });

});