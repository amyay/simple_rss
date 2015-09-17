(function() {

  return {
    requests: {
      getRSSData: function() {
        return {
          url: 'http://www.feedforall.com/sample.xml',
          // dataType: 'json',
     //      contentType: 'application/json',
          type: 'GET',
          async: true
        };
      }
    },

    events: {
      'app.activated'       :     'init',
      'getRSSData.done'     :     'displayRSSData',
      'getRSSData.fail'     :     'genericError'

    },

    init: function() {
      // console.log ('in init');
      this.ajax('getRSSData');
    },

    displayRSSData: function(data) {
      var r = data.getElementsByTagName('item');
      var rssEntryList = [];
      for (var i = 0; i < r.length; i++) {

        // grab the post title
        var title = r[i].getElementsByTagName('title')[0].textContent;

        // grab the post's URL
        var link = r[i].getElementsByTagName('link')[0].textContent;

        // next, the description the second value sets the number of characters to display the 3rd value is what you want the ellipse to be
        // var description = this.truncate(r[i].getElementsByTagName('description')[0].textContent, 300, '...');

        // don't bother truncating because colour elements will get messed up
        var description = r[i].getElementsByTagName('description')[0].textContent;

        // date of entry
        var pubDate = r[i].getElementsByTagName('pubDate')[0].textContent;

        // now create an object and store all data
        var rssEntry = {
          "title"       : title,
          "link"        : link,
          "description" : description,
          "pubDate"     : pubDate
        };

        // push the object into an array
        rssEntryList.push(rssEntry);
      } // end of for loop

      // display content
      this.switchTo('content', {
        rssEntry: rssEntryList
      });
    },

    truncate: function(text, length, ellipsis) {
      // Set length and ellipsis to defaults if not defined
      if (typeof length == 'undefined')  length = 100;
      if (typeof ellipsis == 'undefined')  ellipsis = '...';
      // Return if the text is already lower than the cutoff
      if (text.length < length) return text;
      // Otherwise, check if the last character is a space.
      // If not, keep counting down from the last character
      // until we find a character that is a space
      for (var i = length-1; text.charAt(i) != ' '; i--) {
        length--;
      }
      // The for() loop ends when it finds a space, and the length var
      // has been updated so it doesn't cut in the middle of a word.
      return text.substr(0, length) + ellipsis;
    },

    genericError: function() {
      console.log('generic error');
    }

  };
}());
