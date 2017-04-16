(function () {
  'use strict';

  angular
  .module('app')
  .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', '$http'];
  function HomeController($rootScope, $http) {
    var vm = this;

    vm.authToken = $rootScope.globals.currentUser.authToken;
    var dataUrl = $rootScope.globals.dataUrl;

    vm.searchArtist = searchArtist;
    vm.getArtist = getArtist;
    vm.getPopularTags = getPopularTags;
    vm.getTagDetails = getTagDetails;
        // vm.getLatestReleases = getLatestReleases;
     vm.getAnalytics = getAnalytics;

    var wrapCurl = function(data) {
      return "curl -H \"Content-Type: application/json\" "+ 
      "-H \"Authorization: Bearer " + $rootScope.globals.currentUser.authToken + "\" " +
      "-X POST -d '" + JSON.stringify(data) + "' " +
      $rootScope.globals.dataUrl;
    }

    var wrapQuery = function(data) {
      return {
        method: 'POST',
        url: dataUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + $rootScope.globals.currentUser.authToken
        },
        data : data
      }
      }        

    var searchArtistQuery = vm.searchArtistQuery = {
      type: "select",
      args: {
        "table": "artist",
        "columns": ["id", "name"],
        "where": {"name": {"$ilike": "%Coldplay%" }},
        "limit": 10
      }
    }

    vm.searchArtistCurl = wrapCurl(searchArtistQuery);

    function searchArtist() {

      $http(wrapQuery(searchArtistQuery)).then(
        function success(res){
          vm.searchData = res.data;
        },

        function error(data){
        });
    }

   var getArtistQuery = vm.getArtistQuery = {
      "type": "select",
      "args": {
         "table": "artist",
         "columns": [
            "id",
            "name",
            "sort_name",
            "begin_date_year",
            "begin_date_month",
            {
              "name": "artist_type",
              "columns": ["id", "name"]
            },
            {
              "name": "release_groups",
              "columns": [
                "id",
                "name",
                {
                  "name": "meta",
                  "columns": ["first_release_date_year", "rating"]
                }],
              "order_by": "-meta.first_release_date_year"
              // "where" : {"$not" : { "meta" : {"first_release_date_year": null}}}
            }
          ],
         "where": {"id": 2129}
      }
    }

    vm.getArtistCurl = wrapCurl(getArtistQuery);

    function getArtist() {

      $http(wrapQuery(getArtistQuery)).then(
      function success(res){
        vm.artistData = res.data; 
      },

      function error(data){
      });
    }

    var tagsQuery = vm.tagsQuery = {
      "type": "select",
      "args": {
        "table": "tag",
        "columns": [
          "id",
          "name",
          "ref_count",
        ],
        "order_by": "-ref_count",
        "limit": 100
      }
    }
    
    vm.tagsCurl = wrapCurl(tagsQuery);

    function getPopularTags() {

      $http(wrapQuery(tagsQuery)).then(
      function success(res){
        vm.tagsData = res.data;
      },

      function error(data){
      });

    }

    var tagDetailQuery = vm.tagDetailQuery = {
      "type": "bulk",
      "args": [
        {
          "type": "select",
          "args": {
            "table": "artist_tag",
            "columns": [
              "artist",
              "tag",
              "count",
              {
                "name": "artist_details",
                "columns": ["id", "name"]
              }
            ],
            "where": {"tag": 7},
            "order_by": "-count",
            "limit" : 10,
          }
        },
        {
          "type": "select",
          "args": {
            "table": "event_tag",
            "columns": [
              "event",
              "tag",
              "count",
              {
                "name": "event_details",
                "columns": ["id", "name"]
              }
            ],
            "where": {"tag": 7},
            "order_by": "-count",
            "limit" : 10,
          }
        }
      ]
    }
    
    vm.tagDetailCurl = wrapCurl(tagDetailQuery);

    function getTagDetails() {

      $http(wrapQuery(tagDetailQuery)).then(
      function success(res){
        vm.tagDetailsData = res.data;
      },

      function error(data){
      });

    }

    //   $scope.getLatestReleases = function(offset) {

    //     var latestReleasesQuery = {
    //       "type": "select",
    //       "args": {
    //           "table": "release_group_meta",
    //           "columns": [
    //             "id",
    //             "first_release_date_year",
    //             "first_release_date_month",
    //             "first_release_date_day",
    //             {
    //               "name": "parent",
    //               "columns": [
    //                 "name",
    //                 "artist_credit",
    //                 {"name" : "artist",
    //                  "columns": ["id", "name"]
    //                 }]
    //             }
    //           ],
    //           "order_by": [{"column" : "first_release_date_year", "type": "desc", "nulls": "last"},
    //                        {"column" : "first_release_date_month", "type": "desc", "nulls": "last"},
    //                        {"column" : "first_release_date_day", "type": "desc", "nulls": "last"}
    //                       ],
    // //          "order_by" : ["-first_release_date_year", "-first_release_date_month", "-first_release_date_day"],
    //           "where": { "parent": { "artist": { "name" : { "$neq" : null  } } } },
    //           "limit": 10,
    //           "offset": offset
    //       }
    //     }

    //     $http(wrapQuery(latestReleasesQuery)).then(
    //     function success(res){
    //       $scope.latestReleases = res.data
    //       $scope.currentOffset = offset;
    //     },

    //     function error(data){
    //     });

    //   }

    //   $scope.getDate = function(release) {
    //     return new Date(release.first_release_date_year, release.first_release_date_month, release.first_release_date_day);
    //   }

    var analyticsQuery = vm.analyticsQuery = {
      "type": "select",
      "args": {
          "table": "tag_stats_view",
          "columns": [ "*.*"],
      }
    }

    vm.analyticsCurl = wrapCurl(analyticsQuery);

    function getAnalytics() {

      $http(wrapQuery(analyticsQuery)).then(
      function success(res){
          vm.analyticsData = res.data
      },

      function error(data){
      });

    }





        // function searchArtist(artist) {
        //     MusicService.searchArtist(artist).then(function success(res) {
        //         console.log(res.data);
        //         vm.searchData = res.data;
        //     });
        // }

        // function getArtist(artistId) {
        //     console.log(artistId);
        //     MusicService.getArtist(artistId).then(function success(res) {
        //         vm.artistData = res.data; 
        //     });
        // }

        // function getPopularTags() {
        //     MusicService.getPopularTags().then(function success(res) {
        //         vm.tagsData = res.data;
        //     })
        // }

        // function getTagDetails() {
        //     MusicService.getTagDetails().then(function success(res) {
        //         vm.tagDetailsData = res.data;
        //     })
        // }

        // function getLatestReleases(offset) {
        //     MusicService.getLatestReleases(offset).then(function success(res) {
        //         vm.releasesData = res.data;
        //     })
        // }

        // function getAnalytics() {
        //     MusicService.getAnalytics().then(function success(res) {
        //         vm.analyticsData = res.data
        //     })
        // }

      }

    })();