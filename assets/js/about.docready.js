(function($) {

    "use strict";

    // Global Variables
    var ww = $(window).width();
    var wh = $(window).height();
    var headerheight = 105;
    var footerheight = 45;
    var iah = wh-headerheight-footerheight;
    var siteratio = ww / iah;
    var minww = 0;
    var minwh = 0;
    var gutter = 0;
    var easing = "jswing";
    var speed = 400;
    var fadeOutSpeed = 300;
    var fadeInSpeed = 700;
    var currenturl = window.location.pathname;
    var centered = true;

    $(document).ready(function() {

      adjustFooterHeight(0);

      /* ------ Button for menu dropdown on smaller screens ------- */
      $(".header__icon").click(function(e) {
          if( $("body").hasClass("home") ) {
              e.preventDefault();
              $(".header__icon").toggleClass("is-active");
              $(".large-menu").toggleClass("is-active");
              $(".large-menu_mobile").toggleClass("is-active");
              $(".large-menu-search").toggleClass("is-active");
              return false;
          }
      });

      /* ------ If smaller screen add mobile class to main div ------- */
      if($(window).width() > 769) {
        $("#page__container").addClass("large").removeClass("mobile");
      }
      else {
        $("#page__container").removeClass("large").addClass("mobile");
      }

      /* ------ On resizing, check the screen size again ------- */
      $(window).resize(function() {
        $("#map").height(wh - headerheight - 40);

        if($(window).width() > 769) {
          if($(".mobile").length > 0) {
            $("#page__container").addClass("large").removeClass("mobile");

          }
        }
        else {
          $("#page__container").removeClass("large").addClass("mobile");

        }
        resizeSite();
      });

      /* -------  Button for footer expand --------- */
      $(".single-expand").click(function(e) {
        e.preventDefault();
        /* IF the footer is already expanded then lower it */
        if( $(".single-footer__container").hasClass("expanded") ) {
          $(".single-footer__container").stop().animate( { height: footerheight }, { duration: 200, easing: "jswing" } );
          $(".single-below-footer__container").stop().animate( { marginTop:0 }, { duration: 200, easing: "jswing" } );
          $(".single-footer__container").removeClass("expanded");
          $(".single-footer__more").text(" / Read More");
        }
        else {
          adjustFooterHeight(200);
          $(".single-footer__container").addClass("expanded");
          $(".single-footer__more").text(" / Hide Text");
        }
      });
      /* -------  End Button for footer expand --------- */

      resizeSite();
      $("#proj_img .slide").fadeIn();

    });  // close >> document(ready)

    /* Resize Site */
    function resizeSite() {
       ww = $(window).width();
       wh = $(window).height();
       //headerheight = $(".header__container").height();
       //footerheight = $(".footer__container").height();
       iah = wh-headerheight-footerheight;
       siteratio = ww / iah;

      if(ww < minww) { ww = minww; }
      if(wh < minwh) { wh = minwh; }

      // resize the container
      $("#site, .site").width(ww).height(iah);
      $("#proj_img").width(ww).height(iah);
      $("#proj_img").css("width", ww + "px").css("height", iah + "px");


      // If the window is less than 769px hide the arrows
      if($(".mobile").length == 1) {
        $(".arrw").hide();
        $("#proj_img img").each(function() {
          $(this).removeClass("slide").addClass("project_image");
          $(this).css("width","100%").css("display","block").css("height","");
        });
      }
      // otherwise show them
      else {
        $(".arrw").show();
        $("#proj_img img").each(function() {
          $(this).addClass("slide").removeClass("project_image");
        });
      }

     // resize each picture
      $("#proj_img .slide").each(function() {
        var thisimg = $(this);
        var sf, fit;
        var iR = parseFloat(thisimg.data("r"));
        var sf = thisimg.data("f");

        if (sf == 200) {
          sf = 1;
          fit = false;
        }
        else {
          sf = parseFloat(sf / 100);
          fit = true;
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
          imgResize(thisimg, ww, iah, "position", 0, 0, 0, 0);
        }
      });
      //end resize each picture
      // NOTE: splash3
      $(".arrw.left, .arrw.right").not(".small").height(iah).width(ww/2).css("top","0");

    }
    /* End Resize Site */

    /* Resize Image */
    function imgResize(el, cw, ch, prop, woff, hoff, loff, toff) {
        // element, container width, height, css prop (margin/top), width offset, height offset, left offset, top offset
        //var iR = parseFloat(el.data("r"));
        var ih, iw, cr, ir, iml, imt, sf, fit;

        sf = el.data("f");
        if(sf == 200) {
            sf = 1;
            fit = false;
        } else {
            sf = parseFloat(sf/100);
            fit = true;
        }
        //element ratio
        ir = parseFloat(el.data("r"));
        if (!ir) {
            ir = el.width() / el.height();
        }
        //scale factor
        if (!sf) {
            sf = 1;
        }

        // fit inside container
        if (fit) {
            cr = (cw - woff) / (ch - hoff);
            if (cr > ir) {
                ih = (ch - hoff) * sf;
                iw = ih * ir;
            } else {
                iw = (cw - woff) * sf;
                ih = iw / ir;
            }
            imt = (ch - hoff - ih) / 2;
            iml = (cw - woff - iw) / 2;
        } else { // fill container
            cr = (cw / ch);
            if (ir < 1) { //image is portrait
                iw = cw;
                ih = iw/ir;
                if (ih < ch) {
                    ih = ch;
                    iw = ih * ir;
                    iml = (cw - iw) / 2 - loff;
                    imt = (ch - ih) / 2 - toff;
                } else {
                    imt = (ch - ih) / 2 - toff;
                    iml = (cw - iw) / 2 - loff;
                }
            } else { // image is landscape
                ih = ch;
                iw = ih * ir;

                if (iw < cw) {
                    iw = cw;
                    ih = iw/ir;
                }

                iml = (cw - iw) / 2 - loff;
                imt = (ch - ih) / 2 - toff;
                //imt = 0;
            }
        }

        if(el.hasClass("full")) {
            iw = cw;
            ih = ch;
            iml = 0;
            imt = 0;
        }

        //imt = 0;
        if (prop == "margin") {
            el.width(iw).height(ih).css({marginTop:imt+"px", marginLeft:iml+"px"});
        } else if (prop == "position") {
            el.width(iw).height(ih).css({top:imt+"px",left:iml+"px"});
        } else if (prop == "array") {
            //el.width(iw).height(ih);
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
    function adjustFooterHeight(dur) {
        dur = (typeof b !== "undefined") ?  dur : 200;
        var fh = $(".single-footer__container").height();
        var bfh = $(".single-below-footer__container").outerHeight();
        if (bfh < 33) {
            bfh = 0;
        }

        console.log(bfh);

        if (bfh > (iah - 100)) {
            $(".single-below-footer__description").height(bfh).css('overflow-y', 'scroll');
            bfh = iah - 100;

            $(".single-below-footer__container").css('overflow-y', 'scroll');

        }
        $(".single-footer__container")
            .stop()
            .animate( {height: bfh + footerheight}, {duration: dur, easing: "jswing"} );
        $(".single-below-footer__container").stop().animate({marginTop:-(bfh)},{duration: dur, easing: "jswing"});
        $(".single-below-footer__container").height(bfh);
    }
    /* End: adjustFooterHeight */

})( jQuery );
