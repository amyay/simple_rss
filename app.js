(function() {

  return {
    requests: {
      getRSSData: function(rss_url) {
        return {
          url: rss_url,
          // dataType: 'json',
     //      contentType: 'application/json',
          type: 'GET',
          async: true
        };
      }
    },

    events: {
      'app.activated'       :     'init',
      'getRSSData.done'     :     'processRSSData',
      'getRSSData.fail'     :     'genericError',
      'click .btn_refresh'  :     'init',
      'click .btn_prev'     :     'displayPrevRSSData',
      'click .btn_next'     :     'displayNextRSSData'
    },

    init: function() {
      // console.log ('in init');
      this.rssEntryList = [];
      this.entriesPerPage = Number(this.setting('results_per_page'));
      this.rss_url = this.setting('rss_url');
      this.currentEntry = 0;
      this.nextEntry = this.entriesPerPage;
      this.ajax('getRSSData', this.rss_url);
    },

    processRSSData: function(data) {
      var r = data.getElementsByTagName('item');
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
        this.rssEntryList.push(rssEntry);
      } // end of for loop
      this.displayRSSData();
    },

    displayRSSData: function() {
      // display content
      // if entries to display is less than results_per_page, then display them all, and hide buttons
      if (this.entriesPerPage > this.rssEntryList.length) {
        this.switchTo('content', {
          rssEntry: this.rssEntryList
        });
        this.$('.btn_prev').hide();
        this.$('.btn_next').hide();
      }
      else {
        // split up entries and display accordingly
        var rssEntryListSub = this.rssEntryList.slice(this.currentEntry, this.nextEntry);
        this.switchTo('content', {
          rssEntry: rssEntryListSub
        });

        // hide buttons accordingly
        if (this.currentEntry === 0) {
          this.$('.btn_prev').css('visibility', 'hidden');
        }

        if (this.nextEntry >= this.rssEntryList.length) {
          this.$('.btn_next').css('visibility', 'hidden');
        }
      }
    },

    displayPrevRSSData: function() {
      this.nextEntry = this.currentEntry;
      this.currentEntry = this.currentEntry - this.entriesPerPage;
      this.displayRSSData();
    },

    displayNextRSSData: function() {
      this.currentEntry = this.nextEntry;
      this.nextEntry = this.currentEntry + this.entriesPerPage;
      this.displayRSSData();
    },

    genericError: function() {
      console.log('generic error');
    }

  };
}());
