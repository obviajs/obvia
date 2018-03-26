// Generated by CoffeeScript 1.4.0
(function() {
  var $;

  $ = jQuery;

  $.fn.extend({
    rowslide: function(callback) {
      var $row, $tds, highestTd;
      $row = this;
      $tds = this.find("td");
      highestTd = this.getTallestTd($tds);
      return $row.animate({
        opacity: 0
      }, 300, function() {
        var $td, $wrapper,
          _this = this;
        $tds.each(function(i, td) {
          if (this !== highestTd) {
            $(this).empty();
            return $(this).css("padding", "0");
          }
        });
        $td = $(highestTd);
        $wrapper = $("<div/>");
        $wrapper.css($td.css("padding"));
        $td.css("padding", "0");
        $td.wrapInner($wrapper);
        return $td.children("div").slideUp(300, function() {
          $row.remove();
          if (callback) {
            return callback();
          }
        });
      });
    },
    getTallestTd: function($tds) {
      var height, index;
      index = -1;
      height = 0;
      $tds.each(function(i, td) {
        if ($(td).height() > height) {
          index = i;
          return height = $(td).height();
        }
      });
      return $tds.get(index);
    }
  });

}).call(this);