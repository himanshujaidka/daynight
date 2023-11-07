
(function () {
  // Global variabless
 
    

   



    
    plugins = {
      rdNavbar: $(".rd-navbar"),
    };

  
  // Initialize scripts that require a finished document
  $(function () {
    isNoviBuilder = window.xMode;



    

    


   
     

   

    

    // RD Navbar
    if (plugins.rdNavbar.length) {
      var aliaces, i, j, len, value, values, responsiveNavbar;

      aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
      values = [0, 576, 768, 992, 1200, 1600];
      responsiveNavbar = {};

      for (var z = 0; z < plugins.rdNavbar.length; z++) {
        var $rdNavbar = $(plugins.rdNavbar[z]);

        for (i = j = 0, len = values.length; j < len; i = ++j) {
          value = values[i];
          if (!responsiveNavbar[values[i]]) {
            responsiveNavbar[values[i]] = {};
          }
          if ($rdNavbar.attr('data' + aliaces[i] + 'layout')) {
            responsiveNavbar[values[i]].layout = $rdNavbar.attr('data' + aliaces[i] + 'layout');
          }
          if ($rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
            responsiveNavbar[values[i]]['deviceLayout'] = $rdNavbar.attr('data' + aliaces[i] + 'device-layout');
          }
          if ($rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
            responsiveNavbar[values[i]]['focusOnHover'] = $rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
          }
          if ($rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
            responsiveNavbar[values[i]]['autoHeight'] = $rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
          }

          if (isNoviBuilder) {
            responsiveNavbar[values[i]]['stickUp'] = false;
          } else if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
            var isDemoNavbar = $rdNavbar.parents('.layout-navbar-demo').length;
            responsiveNavbar[values[i]]['stickUp'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true' && !isDemoNavbar;
          }

          if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
            responsiveNavbar[values[i]]['stickUpOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
          }
        }

        $rdNavbar.RDNavbar({
          anchorNav: !isNoviBuilder,
          stickUpClone: ($rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $rdNavbar.attr("data-stick-up-clone") === 'true' : false,
          responsive: responsiveNavbar,
          callbacks: {
            onStuck: function () {
              var navbarSearch = this.$element.find('.rd-search input');

              if (navbarSearch) {
                navbarSearch.val('').trigger('propertychange');
              }
            },
            onDropdownOver: function () {
              return !isNoviBuilder;
            },
            onUnstuck: function () {
              if (this.$clone === null)
                return;

              var navbarSearch = this.$clone.find('.rd-search input');

              if (navbarSearch) {
                navbarSearch.val('').trigger('propertychange');
                navbarSearch.trigger('blur');
              }

            }
          }
        });


        if ($rdNavbar.attr("data-body-class")) {
          document.body.className += ' ' + $rdNavbar.attr("data-body-class");
        }

      }
    }

    // RD Input Label
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }

    // RD Search
    if (plugins.search.length || plugins.searchResults) {
      var handler = "bat/rd-search.php";
      var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
        '<p>...#{token}...</p>' +
        '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
      var defaultFilter = '*.html';

      if (plugins.search.length) {
        for (var i = 0; i < plugins.search.length; i++) {
          var searchItem = $(plugins.search[i]),
            options = {
              element: searchItem,
              filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
              template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
              live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
              liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
              current: 0, processed: 0, timer: {}
            };

          var $toggle = $('.rd-navbar-search-toggle');
          if ($toggle.length) {
            $toggle.on('click', (function (searchItem) {
              return function () {
                if (!($(this).hasClass('active'))) {
                  searchItem.find('input').val('').trigger('propertychange');
                }
              }
            })(searchItem));
          }

          if (options.live) {
            var clearHandler = false;

            searchItem.find('input').on("input propertychange", $.proxy(function () {
              this.term = this.element.find('input').val().trim();
              this.spin = this.element.find('.input-group-addon');

              clearTimeout(this.timer);

              if (this.term.length > 2) {
                this.timer = setTimeout(liveSearch(this), 200);

                if (clearHandler === false) {
                  clearHandler = true;

                  $body.on("click", function (e) {
                    if ($(e.toElement).parents('.rd-search').length === 0) {
                      $('#rd-search-results-live').addClass('cleared').html('');
                    }
                  })
                }

              } else if (this.term.length === 0) {
                $('#' + this.live).addClass('cleared').html('');
              }
            }, options, this));
          }

          searchItem.submit($.proxy(function () {
            $('<input />').attr('type', 'hidden')
              .attr('name', "filter")
              .attr('value', this.filter)
              .appendTo(this.element);
            return true;
          }, options, this))
        }
      }

      if (plugins.searchResults.length) {
        var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
        var match = regExp.exec(location.search);

        if (match !== null) {
          $.get(handler, {
            s: decodeURI(match[1]),
            dataType: "html",
            filter: match[2],
            template: defaultTemplate,
            live: ''
          }, function (data) {
            plugins.searchResults.html(data);
          })
        }
      }
    }

    
  });
}());
