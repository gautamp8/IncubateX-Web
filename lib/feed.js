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
 * Handles the Home and Feed UI.
 */
friendlyPix.Feed = function () {

  /**
   * Initializes the Friendly Pix feeds.
   * @constructor
   */
  function _class() {var _this = this;_classCallCheck(this, _class);
    // List of all posts on the page.
    this.posts = [];
    // Map of posts that can be displayed.
    this.newPosts = {};

    // Firebase SDK.
    this.auth = firebase.app().auth();

    $(document).ready(function () {
      // Pointers to DOM elements.
      _this.pageFeed = $('#page-feed');
      _this.feedImageContainer = $('.fp-image-container', _this.pageFeed);
      _this.noPostsMessage = $('.fp-no-posts', _this.pageFeed);
      _this.nextPageButton = $('.fp-next-page-button button');
      _this.newPostsButton = $('.fp-new-posts-button button');

      // Event bindings.
      _this.newPostsButton.click(function () {return _this.showNewPosts();});});}



  /**
   * Appends the given list of `posts`.
   */_createClass(_class, [{ key: 'addPosts', value: function addPosts(
    posts) {
      // Displays the list of posts
      var postIds = Object.keys(posts);
      for (var i = postIds.length - 1; i >= 0; i--) {
        this.noPostsMessage.hide();
        var postData = posts[postIds[i]];
        var post = new friendlyPix.Post();
        this.posts.push(post);
        var postElement = post.fillPostData(postIds[i], postData.thumb_url || postData.url, 
        postData.text, postData.author, postData.timestamp, null, null, postData.full_url);
        // If a post with similar ID is already in the feed we replace it instead of appending.
        var existingPostElement = $('.fp-post-' + postIds[i], this.feedImageContainer);
        if (existingPostElement.length) {
          existingPostElement.replaceWith(postElement);} else 
        {
          this.feedImageContainer.append(postElement.addClass('fp-post-' + postIds[i]));}}}




    /**
     * Shows the "load next page" button and binds it the `nextPage` callback. If `nextPage` is `null`
     * then the button is hidden.
     */ }, { key: 'toggleNextPageButton', value: function toggleNextPageButton(
    nextPage) {var _this2 = this;
      this.nextPageButton.unbind('click');
      if (nextPage) {
        var loadMorePosts = function loadMorePosts() {
          _this2.nextPageButton.prop('disabled', true);
          console.log('Loading next page of posts.');
          nextPage().then(function (data) {
            _this2.addPosts(data.entries);
            _this2.toggleNextPageButton(data.nextPage);});};


        this.nextPageButton.show();
        // Enable infinite Scroll.
        friendlyPix.MaterialUtils.onEndScroll(100).then(loadMorePosts);
        this.nextPageButton.prop('disabled', false);
        this.nextPageButton.click(loadMorePosts);} else 
      {
        this.nextPageButton.hide();}}



    /**
     * Prepends the list of new posts stored in `this.newPosts`. This happens when the user clicks on
     * the "Show new posts" button.
     */ }, { key: 'showNewPosts', value: function showNewPosts() 
    {
      var newPosts = this.newPosts;
      this.newPosts = {};
      this.newPostsButton.hide();
      var postKeys = Object.keys(newPosts);

      for (var i = 0; i < postKeys.length; i++) {
        this.noPostsMessage.hide();
        var post = newPosts[postKeys[i]];
        var postElement = friendlyPix.post.clone();
        this.posts.push(postElement);
        this.feedImageContainer.prepend(postElement.fillPostData(postKeys[i], post.thumb_url || 
        post.url, post.text, post.author, post.timestamp, null, null, post.full_url));}}



    /**
     * Displays the general posts feed.
     */ }, { key: 'showGeneralFeed', value: function showGeneralFeed() 
    {var _this3 = this;
      // Clear previously displayed posts if any.
      this.clear();

      // Load initial batch of posts.
      friendlyPix.firebase.getPosts().then(function (data) {
        // Listen for new posts.
        var latestPostId = Object.keys(data.entries)[Object.keys(data.entries).length - 1];
        friendlyPix.firebase.subscribeToGeneralFeed(
        function (postId, postValue) {return _this3.addNewPost(postId, postValue);}, latestPostId);

        // Adds fetched posts and next page button if necessary.
        _this3.addPosts(data.entries);
        _this3.toggleNextPageButton(data.nextPage);});


      // Listen for posts deletions.
      friendlyPix.firebase.registerForPostsDeletion(function (postId) {return _this3.onPostDeleted(postId);});}


    /**
     * Shows the feed showing all followed users.
     */ }, { key: 'showHomeFeed', value: function showHomeFeed() 
    {var _this4 = this;
      // Clear previously displayed posts if any.
      this.clear();

      if (this.auth.currentUser) {
        // Make sure the home feed is updated with followed users's new posts.
        friendlyPix.firebase.updateHomeFeeds().then(function () {
          // Load initial batch of posts.
          friendlyPix.firebase.getHomeFeedPosts().then(function (data) {
            var postIds = Object.keys(data.entries);
            if (postIds.length === 0) {
              _this4.noPostsMessage.fadeIn();}

            // Listen for new posts.
            var latestPostId = postIds[postIds.length - 1];
            friendlyPix.firebase.subscribeToHomeFeed(
            function (postId, postValue) {
              _this4.addNewPost(postId, postValue);}, 
            latestPostId);

            // Adds fetched posts and next page button if necessary.
            _this4.addPosts(data.entries);
            _this4.toggleNextPageButton(data.nextPage);});


          // Add new posts from followers live.
          friendlyPix.firebase.startHomeFeedLiveUpdaters();

          // Listen for posts deletions.
          friendlyPix.firebase.registerForPostsDeletion(function (postId) {return _this4.onPostDeleted(postId);});});}}




    /**
     * Triggered when a post has been deleted.
     */ }, { key: 'onPostDeleted', value: function onPostDeleted(
    postId) {
      // Potentially remove post from in-memory new post list.
      if (this.newPosts[postId]) {
        delete this.newPosts[postId];
        var nbNewPosts = Object.keys(this.newPosts).length;
        this.newPostsButton.text('Display ' + nbNewPosts + ' new posts');
        if (nbNewPosts === 0) {
          this.newPostsButton.hide();}}



      // Potentially delete from the UI.
      $('.fp-post-' + postId, this.pageFeed).remove();}


    /**
     * Adds a new post to display in the queue.
     */ }, { key: 'addNewPost', value: function addNewPost(
    postId, postValue) {
      this.newPosts[postId] = postValue;
      this.newPostsButton.text('Display ' + Object.keys(this.newPosts).length + ' new posts');
      this.newPostsButton.show();}


    /**
     * Clears the UI.
     */ }, { key: 'clear', value: function clear() 
    {
      // Delete the existing posts if any.
      $('.fp-post', this.feedImageContainer).remove();

      // Hides the "next page" and "new posts" buttons.
      this.nextPageButton.hide();
      this.newPostsButton.hide();

      // Remove any click listener on the next page button.
      this.nextPageButton.unbind('click');

      // Stops then infinite scrolling listeners.
      friendlyPix.MaterialUtils.stopOnEndScrolls();

      // Clears the list of upcoming posts to display.
      this.newPosts = {};

      // Displays the help message for empty feeds.
      this.noPostsMessage.hide();

      // Remove Firebase listeners.
      friendlyPix.firebase.cancelAllSubscriptions();

      // Stops all timers if any.
      this.posts.forEach(function (post) {return post.clear();});
      this.posts = [];} }]);return _class;}();



friendlyPix.feed = new friendlyPix.Feed();
//# sourceMappingURL=feed.js.map