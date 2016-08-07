/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

window.friendlyPix = window.friendlyPix || {};

/**
 * Handles the Friendly Pix search feature.
 */
friendlyPix.Search = function () {_createClass(_class, null, [{ key: 'MIN_CHARACTERS', 

    /**
     * The minimum number of characters to trigger a search.
     * @return {number}
     */get: function get() 
    {
      return 3;}


    /**
     * The maximum number of search results to be displayed.
     * @return {number}
     */ }, { key: 'NB_RESULTS_LIMIT', get: function get() 
    {
      return 10;}


    /**
     * Initializes the Friendly Pix search bar.
     */ }]);
  function _class() {var _this = this;_classCallCheck(this, _class);
    // Firebase SDK.
    this.database = firebase.app().database();

    $(document).ready(function () {
      // DOM Elements pointers.
      _this.searchField = $('#searchQuery');
      _this.searchResults = $('#fp-searchResults');

      // Event bindings.
      _this.searchField.keyup(function () {return _this.displaySearchResults();});
      _this.searchField.focus(function () {return _this.displaySearchResults();});
      _this.searchField.click(function () {return _this.displaySearchResults();});});}



  /**
   * Display search results.
   */_createClass(_class, [{ key: 'displaySearchResults', value: function displaySearchResults() 
    {var _this2 = this;
      var searchString = this.searchField.val().toLowerCase().trim();
      if (searchString.length >= friendlyPix.Search.MIN_CHARACTERS) {
        friendlyPix.firebase.searchUsers(searchString, friendlyPix.Search.NB_RESULTS_LIMIT).then(
        function (results) {
          _this2.searchResults.empty();
          var peopleIds = Object.keys(results);
          if (peopleIds.length > 0) {
            _this2.searchResults.fadeIn();
            $('html').click(function () {
              $('html').unbind('click');
              _this2.searchResults.fadeOut();});

            peopleIds.forEach(function (peopleId) {
              var profile = results[peopleId];
              _this2.searchResults.append(
              friendlyPix.Search.createSearchResultHtml(peopleId, profile));});} else 

          {
            _this2.searchResults.fadeOut();}});} else 


      {
        this.searchResults.empty();
        this.searchResults.fadeOut();}}



    /**
     * Returns the HTML for a single search result
     */ }], [{ key: 'createSearchResultHtml', value: function createSearchResultHtml(
    peopleId, peopleProfile) {
      return '\n        <a class="fp-searchResultItem fp-usernamelink mdl-button mdl-js-button" href="/user/' + 
      peopleId + '">\n            <div class="fp-avatar"style="background-image: url(' + (
      peopleProfile.profile_picture || 
      '/images/silhouette.jpg') + ')"></div>\n            <div class="fp-username mdl-color-text--black">' + 
      peopleProfile.full_name + '</div>\n        </a>';} }]);return _class;}();




friendlyPix.search = new friendlyPix.Search();
//# sourceMappingURL=search.js.map