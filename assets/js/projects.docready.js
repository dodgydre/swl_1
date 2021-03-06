(function($) {

//"use strict";

// Global Variables
var ww = $(window).width(),
    wh = $(window).height(),
    headerheight = 105,
    footerheight = 45,
    iah = wh-headerheight-footerheight,
    siteratio = ww / iah,
    minww = 0,
    minwh = 0,
    gutter = 0,
    easing = "jswing",
    speed = 400,
    fadeOutSpeed = 300,
    fadeInSpeed = 700,
    currenturl = window.location.pathname;

$(document).ready(function() {
  /*
  if($('.admin-bar').first().length > 0) {
    headerheight = 105+32;
  }
  */

  /* -------  Button for menu dropdown on smaller screens --------- */
  /*$('.header__icon').click(function(e) {
    $('.header__icon').toggleClass('is-active');
    $('.large-menu').toggleClass('is-active');
    $('.large-menu-mobile').toggleClass('is-active');
    return false;
    });*/
  $('.header__icon').click(function(e) {
      if( $('body').hasClass('home') ) {
          e.preventDefault();
          $('.header__icon').toggleClass('is-active');
          $('.large-menu').toggleClass('is-active');
          $('.large-menu_mobile').toggleClass('is-active');
          $('.large-menu-search').toggleClass('is-active');
          return false;
      } else {

      }
  });


  /* -------  Button for footer expand --------- */
  $('.single-expand').click(function(e) {
    e.preventDefault();
    /* IF the footer is already expanded then lower it */
    if( $('.single-footer__container').hasClass('expanded') ) {
      $('.single-footer__container').stop().animate( { height: footerheight }, { duration: 20, easing: 'jswing' } );
      $('.single-below-footer__container').stop().animate( { marginTop:0 }, { duration: 20, easing: 'jswing' } );
      $('.single-footer__container').removeClass('expanded');
      $('.single-footer__more').text(' / Read More');
    }
    else {
      adjustFooterHeight();
      $('.single-footer__container').addClass('expanded');
      $('.single-footer__more').text(' / Hide Text');
    }
  });

  /* -------  If smaller screen add mobile class to main div --------- */
  if( $(window).width() > 769 ) {
    $('#proj_img').addClass('large').removeClass('mobile');
    $('#proj_img_container').addClass('large').removeClass('mobile');
    $('proj_img img').addClass('slide');
  } else {
    $('#proj_img').removeClass('large').addClass('mobile');
    $('#proj_img_container').addClass('mobile').removeClass('large');
    $('#proj_img img').removeClass('slide');
    $('.arrw').hide();
  }

  /* -------  On resizing, check the screen size again --------- */
  $(window).resize(function() {
    if($(window).width() > 769) {
      if($('.mobile').length > 0) {
        $('#proj_img').addClass('large').removeClass('mobile');
        $('#proj_img_container').addClass('large').removeClass('mobile');

        $("#proj_img img").hide();
        $('#proj_img .active img').first().fadeIn(400);

        var caption = $('#proj_img .active img').first().nextAll('.caption').first().html();
        var description = $('#proj_img .active img').first().nextAll('.description').first().html();
        var imagedate = $('#proj_img .active img').first().nextAll('.date').first().html();

        $('.single-footer__caption').html(caption);
        $('.single-footer__caption-date').html(imagedate);
        $('.single-below-footer__description').html(description);
      }
    }
    else {
      $('#proj_img').removeClass('large').addClass('mobile');
      $('#proj_img_container').removeClass('large').addClass('mobile');

    }
    resizeSite();
  });


  resizeSite();
  //$(window).resize(resizeSite);

  // When History changes, get the current page
  // TODO: Check this:
	var History = window.History;
	if (History.enabled) {
		History.Adapter.bind(window,'statechange',function(){
      var State = History.getState();
			var url = document.createElement('a');
			url.href = State.url;
			getPage(url.pathname,false);
		});
		var hash = window.location.hash;
		if(hash){
			History.Adapter.trigger(window, 'statechange')
		}
	}

  // Hide Images and Fade in the first one
  if(!$.browser.msie) {
    if($("#proj_img").length > 0) {
      //hide all images
      $("#proj_img img").hide();
      $('#proj_img .active img').first().fadeIn(400);
      var caption = $('#proj_img .active img').first().nextAll('.caption').html();
      var description = $('#proj_img .active img').first().nextAll('.description').html();
      var imagedate = $('#proj_img .active img').first().nextAll('.date').html();

      $('.single-footer__caption').html(caption);
      $('.single-footer__caption-date').html(imagedate);
      $('.single-below-footer__description').html(description);

      // TODO: Check why this on load isn't working!!
      /*firstImg.on('load',function(){
        console.log('showing');
        $(this).fadeIn(400);
      });*/
    }
  }

  // Project Table Sorting?

  // Project Slider
  $("#proj_img.project .arrw").click(function(  ) {
    var thislink = $(this);

    if($(this).hasClass("left")) {
      var dir = "l";
    }
    else if ($(this).hasClass("right")) {
      var dir = "r";
    }
    else if ($(this).hasClass("up")) {
      var dir = "u";
    }
    else if ($(this).hasClass("down")) {
      var dir = "d";
    }

    resizeSite();


    var thisSlideShow = $("#proj_img");
    var thisProject = $(".proj.active");
    var current = $(".proj.active .slide:visible");

    /*  ----- CLICK LEFT (Prev Slide) -------*/
    if (dir == "l") {
      if (thisProject.find(".slide").length > 1) {
        // if the current slide is not the first then move one to the left.
        if (current.prevAll(".proj.active .slide").first().length > 0) {
          var slideToShow = current.prevAll(".proj.active .slide").first();
        }
        // if the current slide IS the first one then slide to the last slide
        else {
          var slideToShow = $(".proj.active .slide").eq($(".proj.active .slide").length-1);
        }

        /* If the footer is epanded, shrink it */
        if( $('.single-footer__container').hasClass('expanded' ) ) {
          $('.single-expand').click();
        }

        if (thisSlideShow.hasClass("fading")){
					current.fadeOut(fadeOutSpeed);
					slideToShow.fadeIn(fadeInSpeed);
				}
        else if ( thisSlideShow.hasClass("sliding")) {
          // TODO: Check if Pete wants centred or Left oriented
          var imgDim = imgResize(slideToShow, ww, iah, "array", 0, 0, 0, 0);
          var currentLeft = current.offset().left;
          var nextCurrentLeft = currentLeft + ww + gutter;
          var nextNextLeft = (imgDim[2]-ww-gutter);

          current.stop().animate({ left:nextCurrentLeft }, { duration: speed, easing: easing } ).hide(0).css("left",currentLeft+"px");
          slideToShow.css( "left" , nextNextLeft + "px" ).show(0).stop().animate({ left:imgDim[2] },{ duration: speed, easing: easing });
        }
        var captionText = slideToShow.next("span").html();
        $("footer .imgcap").html(captionText);
        if (slideToShow.hasClass("video")) {
          $(".arrw.left, .arrw.right").height(iah/2);
          $(".arrw.down").hide();
        }
        else {
          $("arrw.left, .arrw.right").height(iah-120);
          $("arrw.down").show();
        }
        // If we want the image numebr...
        // TODO: Add the diagram to the bottom right showing image boxes and update
        //$("#footer .ic").text(slideToShow.index(".proj.active .slide")+1);
      }
    }

    /*  ----- CLICK RIGHT (Next Slide) -------*/
    else if (dir == "r") {
      if (thisProject.find(".slide").length > 1) {
        if (current.nextAll(".proj.active .slide").first().length > 0) {
          // If we're not on the last slide, move one forward
          var slideToShow = current.nextAll(".proj.active .slide").first();
          //$('.moving_bg').animate({left: "+=13"}, 500);
        }
        else {
          // if we are on the last slide move back to the start
          var slideToShow = $(".proj.active .slide:first-child");
          //$('.moving_bg').animate({left: 0}, 500);
        }

        /* If the footer is expanded, shrink it */
        if( $('.single-footer__container').hasClass('expanded') ) {
          $('.single-expand').click();
        }

        if (thisSlideShow.hasClass("fading")) {
          current.fadeOut(fadeOutSpeed);
          slideToShow.fadeIn(fadeInSpeed);
        }
        else if (thisSlideShow.hasClass("sliding")) {
          // TODO: Check if Pete wants left justified.

          var imgDim = imgResize(slideToShow,ww,iah,"array",0,0,0,0);
          var currentLeft = current.offset().left;
          var nextCurrentLeft = -(ww+gutter);
          var nextNextLeft = (imgDim[2]+ww+gutter);
          current.stop().animate({ left: nextCurrentLeft },{ duration: speed, easing: easing }).hide(0).css("left",currentLeft+"px");
          slideToShow.css("left", nextNextLeft+"px").show(0).stop().animate({ left: imgDim[2] }, { duration: speed, easing: easing });
        }

        var captionText = slideToShow.next("span").html();
        $("#footer .imgcap").html(captionText);
        if (slideToShow.hasClass("video")) {
          $(".arrw.left, .arrw.right").height(iah/2);
          $(".arrw.down").hide();
        }
        else {
          $(".arrw.left, .arrw.right").height(iah-120);
          $(".arrw.down").show();
        }

        // If we want the image number... or the image map
        // TODO: Add the diagram to the bottom right showing image boxes and update
        //$("#footer .ic").text(slideToShow.index(".proj.active .slide")+1);
        //$("#footer .ic").text(slideToShow.index(".proj.active .slide")+1);
      }
    }
    else if (dir == "u" || dir == "d") {
      /* TODO: Does this update the caption as well? */
      var href = thislink.attr("href");
      History.pushState(null, null, href);
    }

    if (dir == "l" || dir == "r") {
      // TODO: if footer is expanded then close the footer
    }



    return false;
  }); // close >> #proj_img.project .arrw click

  // Use Keyboard instead of Mouse
  $(document).keydown(function(e) {
    if (e.which == 37 && !e.metaKey) {
      e.preventDefault();
      $(".arrw.left").click();
    }
    else if (e.which == 38 && !e.metaKey) {
      e.preventDefault();
      $(".arrw.up").click();
    }
    else if (e.which == 39 && !e.metaKey) {
      e.preventDefault();
      $(".arrw.right").click();
    }
    else if (e.which == 40 && !e.metaKey) {
      e.preventDefault();
      $(".arrw.down").click();
    }
  });

  // NOTE: jQuery.touchSwipe.min.js
  $(".arrw").swipe( {
      //Generic swipe handler for all directions
      swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
        console.log("You swiped " + direction );
        if(direction == "left") {
          $('.arrw.right').click();
        }
        if(direction == "right") {
          $('.arrw.left').click();
        }
        if(direction == "down") {
          $('.arrw.up').click();
        }
        if(direction == "up") {
          $('.arrw.down').click();
        }
      }
    });

});  // close >> document(ready)

$(window).load(function(){
  getPrevAndNextButtons($(".proj.active"));
	loadPrevAndNextProject($(".proj.active"));
  //generateTabs();
});


/* Resize Site */
function resizeSite() {
  ww = $(window).width();
  wh = $(window).height();
  iah = wh - headerheight - footerheight;
  siteratio = ww / iah;

  if(ww < minww) ww = minww;
  if(wh < minwh) wh = minwh;

  // resize the container
  $('#site, .scrollwrap, .site').width(ww).height(iah);
  $('#proj_img').width(ww).height(iah);
  $('#proj_img').css('width', ww + "px").css('height', iah + "px");

  // resize each picture
  $('#proj_img .slide').each(function() {
    var thisimg = $(this);
    var iR = parseFloat(thisimg.data("r"));
    var sf = thisimg.data("f");

    if (sf == 200) {
      sf = 1;
      var fit = false;
    }
    else {
      sf = parseFloat(sf / 100);
      var fit = true;
    }
    if ($(this).hasClass("full")) {
      var thisimg = $(this);
      containerW = ww;
      containerH = iah;
      containerAspect = ww / iah;
      imageAspect = iR;

      if ( containerAspect < imageAspect ) {
          var iw = iah * imageAspect;
          $(this)
            .css('width', iw)
            .css('height', iah)
            .css('top', '0')
            .css('left', (-(iah*imageAspect-ww)/2));
      } else {
          var ih = ww / imageAspect;
          $(this)
            .css('width', ww)
            .css('height', ih)
            .css('top', (-(ww/imageAspect-iah)/2))
            .css('left', '0');
      }

    }
    else {
      imgResize(thisimg, ww, iah, "position", 0, 0, 0, 0)
    }
  });
  //end resize each picture

  var currentSlide = $(".slideshow .slide:visible");
  if (currentSlide.length > 0 && currentSlide.hasClass("video")) {
    if($(".arrw.down").length > 0) {
      $(".arrw.left, .arrw.right").height(iah/2).width(ww/2-ww/2);
      $(".arrw.down").hide();
    }
    else {
      $(".arrw.left, .arrw.right").height(iah/1.5).width(ww/2-ww/2);
    }
  }
  else {
    $(".arrw.left, .arrw.right").height(iah-iah/4).width(ww/2-ww/10);
    $(".arrw.down").show();
  }
}
/* End Resize Site */

/* Resize Image */
function imgResize(el, cw, ch, prop, woff, hoff, loff, toff) {
  // element, container width, height, css prop (margin/top), width offset, height offset, left offset, top offset
  var iR = parseFloat(el.data("r"));
  var sf = el.data("f");

  if(sf == 200) {
    sf = 1;
    var fit = false;
  }
  else {
    sf = parseFloat(sf/100);
    var fit = true;
  }

  //element ratio
  var ir = parseFloat(el.data("r"));
  if (!ir) {
    ir = el.width() / el.height();
  }
  //scale factor
  if (!sf) {
    sf = 1;
  }

  // fit inside container
  if (fit) {
    var cr = (cw - woff) / (ch - hoff);
    if (cr > ir) {
      var ih = (ch - hoff) * sf;
      var iw = ih * ir;
    }
    else {
      var iw = (cw - woff) * sf;
      var ih = iw / ir;
    }
    var imt = (ch - hoff - ih) / 2;
    //var imt = 0; // over-riding to force the image to be top of screen
    var iml = (cw - woff - iw) / 2;
  }
  // fill container
  else {
    var cr = (cw / ch);
    if (ir < 1) {
      //image is portrait
      var iw = cw;
      var ih = iw/ir;
      if (ih < ch) {
        var ih = ch;
        var iw = ih * ir;
        var iml = (cw - iw) / 2 - loff;
        var imt = (ch - ih) / 2 - toff;
      }
      else {
        var imt = (ch - ih) / 2 - toff;
        var iml = (cw - iw) / 2 - loff;
      }
    }
    // image is landscape
    else {
      var ih = ch;
      var iw = ih * ir;
      if (iw < cw) {
        var iw = cw;
        var ih = iw/ir;
      }
      var iml = (cw - iw) / 2 - loff;
      var imt = (ch - ih) / 2 - toff;
    }
  }

  if(el.hasClass('full')) {
    var iw = cw;
    var ih = ch;
    var iml = 0;
    var imt = 0;
  }

  if (prop == "margin") {
    el.width(iw).height(ih).css({marginTop:imt+"px", marginLeft:iml+"px"});
  }
  else if (prop == "position") {
    el.width(iw).height(ih).css({top:imt+"px",left:iml+"px"});
    if( el.hasClass('video') ) {
      el.find('iframe').height(ih).width(iw);
    }
  }
  else if (prop == "array") {
    var imgDim = new Array(4);
    imgDim[0] = iw;
    imgDim[1] = ih;
    imgDim[2] = iml;
    imgDim[3] = imt;
    return imgDim;
  }
}
/* End Resize Image */

/* Start: adjustFooterHeight */
function adjustFooterHeight() {
  var fh = $('.single-footer__container').height();
  var bfh = $('.single-below-footer__container').outerHeight();
  if ( bfh < 33 ) bfh = 0;
  $('.single-footer__container')
    .stop()
    .animate( { height: bfh + footerheight }, { duration: 200, easing: 'jswing'} );
  $('.single-below-footer__container')
    .stop()
    .animate( { marginTop: -(bfh) }, { duration: 200, easing: 'jswing' } );
}
/* End: adjustFooterHeight */




/* Get Current Page URL */
function getPage(href, push) {
  if (href[0] != "/") { href = "/" + href; }
  if (currenturl[0] != "/") { currenturl = "/" + currenturl; }

  var l = href.split("/");
  var cl = currenturl.split("/");

  if (href != currenturl) {
    if ( l[2] == "project" ) {
      // send the slug only
      goToProject(href, l[3]);
    }
    currenturl = href;
  }
}
/* End Get Current Page URL */

/* Go to Project */
function goToProject(href, slug) {
  var thisSlideShow = $('#proj_img');
  var thisProj = $(".proj.active");
  var current = $(".proj.active .slide:visible");

  nextProj = $("#p_" + slug);
  if (nextProj.index() > thisProj.index()) {
    if (thisProj.index() == 0 && nextProj.index() == $(".proj").length-1) {
      var dir = "u";
    }
    else {
      var dir = "d";
    }
  }
  else {
    if (thisProj.index() == $(".proj").length-1 && nextProj.index() == 0){
      var dir = "d";
    }
    else {
      var dir = "u";
    }
  }
  if (nextProj.html() == "") {
    getNewProject(thisProj, current, nextProj, dir, true);
  }
  else {
    slideToProject(thisProj, current, nextProj, dir);
  }

}

function getNewProject(thisProject, current, nextProj, dir, doSlide) {
  var project_id = nextProj.data("id");

  // TODO: Add Ajax to retrieve the next project images
  jQuery.ajax({
    url: ajaxgetprojectimgs.ajaxurl,
    type: 'post',
    data: {
      action: 'ajax_get_project_imgs',
      project_id: project_id,
    },
    dataType: 'json',
    success: function(result) {
      jQuery.each(result, function(index, value) {
        nextProj.append(value);
      });
      resizeSite();

      if (doSlide) {
        slideToProject(thisProject, current, nextProj, dir);
      }
    }
  });
}

/* Load Previous and Next Project Images */
function loadPrevAndNextProject(thisProj) {
  // is the next project the next one along?
  if (thisProj.next(".proj").first().length>0) {
    var nextProj = thisProj.nextAll(".proj").first();
  }
  // if not then the next project is the first project
  else {
    var nextProj = $(".proj:first-child");
  }
  // If the next project is currently empty, load in the images
  if (nextProj.html() == "") {
    getNewProject(thisProj, "", nextProj, "", false);
  }

  // is the previous project one back?
  if (thisProj.prevAll(".proj").first().length > 0) {
    var prevProj = thisProj.prevAll(".proj").first();
  }
  // if not then the previous project is the last project
  else {
    var prevProj = $(".proj").eq($("proj").length-1);
  }

  // If the previous project is currently empty, load in the images
  if (prevProj.html() == "") {
    getNewProject(thisProj, "", prevProj, "" , false);
  }
}
/* End Load Previous and Next Project Images */

function slideToProject(thisProj, current, nextProj, dir) {
  var currentLeft = current.offset().left;
  var slideToShow = nextProj.find(".slide:first-child");

  var imgDim = imgResize(slideToShow, ww, iah, "array", 0, 0, 0, 0);

  var currentTop = current.offset().top;

  var table = nextProj.parent().data("t");
  if (table == "projects") {
    var directory = "project";
  }

  /* If the footer is epanded, shrink it */
  if( $('.single-footer__container').hasClass('expanded' ) ) {
    $('.single-expand').click();
  }

  if (dir == "u") {
    current.stop().animate({ top: currentTop+wh+gutter } , { duraction: speed-100, easing: easing }).hide().css("top", currentTop + "px");
    slideToShow.css("top",(imgDim[3]-wh-gutter)+"px").show(0).stop().animate({ top:imgDim[3] },{ duration: speed, easing: easing });

    var newLeft = ($(".proj.active .slide").length-1) * 13;
    //$('.moving_bg').animate({left: 0}, 500);
  }
  else {
    current.stop().animate({top:(currentTop-wh)},{duration: speed-100, easing: easing}).hide(0).css("top",currentTop+"px");
    slideToShow.css("top",(ww+imgDim[3])+"px").show(0).stop().animate({ top: imgDim[3] },{ duration: speed, easing: easing });
    //$('.moving_bg').animate({left: 0}, 500);
  }

  thisProj.removeClass("active");
  nextProj.addClass("active");

  var caption = $('#proj_img .active img').first().nextAll('.caption').first().html();
  var description = $('#proj_img .active img').first().nextAll('.description').first().html();
  var imagedate = $('#proj_img .active img').first().nextAll('.date').first().html();

  $('.single-footer__caption').html(caption);
  $('.single-footer__caption-date').html(imagedate);
  $('.single-below-footer__description').html(description);

  getPrevAndNextButtons(nextProj);
  document.title = (nextProj.data("title")) + "- Structure Workshop";
  loadPrevAndNextProject(nextProj);


}

function getPrevAndNextButtons(thisProj) {
  var table = thisProj.parent().data("t");
  if (table == "projects") {
    var directory = "project";
  }

  if (thisProj.next(".proj").first().length>0) {
    var nextProj = thisProj.nextAll(".proj").first();
  }
  // if not then the next project is the first project
  else {
    var nextProj = $(".proj:first-child");
  }

  // is the previous project one back?
  if (thisProj.prevAll(".proj").first().length > 0) {
    var prevProj = thisProj.prevAll(".proj").first();
  }
  // if not then the previous project is the last project
  else {
    var prevProj = $(".proj").eq($("proj").length-1);
  }

  var nextURL = siteUrl + "/" + directory + "/" + nextProj.attr("id").replace("p_","");
  var prevURL = siteUrl + "/" + directory + "/" + prevProj.attr("id").replace("p_","");

  $(".arrw.down").attr("href", nextURL).attr("data-id",nextProj.data("id"));
  $(".arrw.up").attr("href", prevURL).attr("data-id",prevProj.data("id"));

}


function generateTabs() {
  var projects = $('.proj');
  var numProjects = projects.length;
  for(var i = 0; i<numProjects; i++) {
    $('.tabs_container').append('<div class="tabs"></div>');
  }

  var projectImages = new Array(numProjects);
  projects.each(function(index) {
    projectImages[index] = $(this).find('img').length;
    for(var i = 0; i<projectImages[index]; i++) {
      $('.tabs_container .tabs').eq(index).append('<span class="tab_item"></span>');
    }
    if($('.tabs').eq($('.proj.active').index()).find('.moving_bg').length == 0) {
      $('.tabs').eq($('.proj.active').index()).append('<div class="moving_bg"></div>');
    }
  });
  console.log(projectImages);
}

})( jQuery );
