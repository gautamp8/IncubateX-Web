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
 * Handles all Firebase interactions.
 */
friendlyPix.Firebase = function () {_createClass(_class, null, [{ key: 'POSTS_PAGE_SIZE', 
    /**
     * Number of posts loaded initially and per page for the feeds.
     * @return {number}
     */get: function get() 
    {
      return 5;}


    /**
     * Number of posts loaded initially and per page for the User Profile page.
     * @return {number}
     */ }, { key: 'USER_PAGE_POSTS_PAGE_SIZE', get: function get() 
    {
      return 6;}


    /**
     * Number of posts comments loaded initially and per page.
     * @return {number}
     */ }, { key: 'COMMENTS_PAGE_SIZE', get: function get() 
    {
      return 3;}


    /**
     * Initializes this Firebase facade.
     * @constructor
     */ }]);
  function _class() {_classCallCheck(this, _class);
    // Firebase SDK.
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.auth = firebase.auth();

    // Firebase references that are listened to.
    this.firebaseRefs = [];}


  /**
   * Turns off all Firebase listeners.
   */_createClass(_class, [{ key: 'cancelAllSubscriptions', value: function cancelAllSubscriptions() 
    {
      this.firebaseRefs.forEach(function (ref) {return ref.off();});
      this.firebaseRefs = [];}


    /**
     * Subscribes to receive updates from a post's comments. The given `callback` function gets
     * called for each new comment to the post with ID `postId`.
     *
     * If provided we'll only listen to comments that were posted after `latestCommentId`.
     */ }, { key: 'subscribeToComments', value: function subscribeToComments(
    postId, callback, latestCommentId) {
      return this._subscribeToFeed('/comments/' + postId, callback, latestCommentId, false);}


    /**
     * Paginates comments from the post with ID `postId`.
     *
     * Fetches a page of `COMMENTS_PAGE_SIZE` comments from the post.
     *
     * We return a `Promise` which resolves with an Map of comments and a function to the next page or
     * `null` if there is no next page.
     */ }, { key: 'getComments', value: function getComments(
    postId) {
      return this._getPaginatedFeed('/comments/' + postId, 
      friendlyPix.Firebase.COMMENTS_PAGE_SIZE, null, false);}


    /**
     * Subscribes to receive updates to the general posts feed. The given `callback` function gets
     * called for each new post to the general post feed.
     *
     * If provided we'll only listen to posts that were posted after `latestPostId`.
     */ }, { key: 'subscribeToGeneralFeed', value: function subscribeToGeneralFeed(
    callback, latestPostId) {
      return this._subscribeToFeed('/posts/', callback, latestPostId);}


    /**
     * Paginates posts from the global post feed.
     *
     * Fetches a page of `POSTS_PAGE_SIZE` posts from the global feed.
     *
     * We return a `Promise` which resolves with an Map of posts and a function to the next page or
     * `null` if there is no next page.
     */ }, { key: 'getPosts', value: function getPosts() 
    {
      return this._getPaginatedFeed('/posts/', friendlyPix.Firebase.POSTS_PAGE_SIZE);}


    /**
     * Subscribes to receive updates to the home feed. The given `callback` function gets called for
     * each new post to the general post feed.
     *
     * If provided we'll only listen to posts that were posted after `latestPostId`.
     */ }, { key: 'subscribeToHomeFeed', value: function subscribeToHomeFeed(
    callback, latestPostId) {
      return this._subscribeToFeed('/feed/' + this.auth.currentUser.uid, callback, latestPostId, 
      true);}


    /**
     * Paginates posts from the user's home feed.
     *
     * Fetches a page of `POSTS_PAGE_SIZE` posts from the user's home feed.
     *
     * We return a `Promise` which resolves with an Map of posts and a function to the next page or
     * `null` if there is no next page.
     */ }, { key: 'getHomeFeedPosts', value: function getHomeFeedPosts() 
    {
      return this._getPaginatedFeed('/feed/' + this.auth.currentUser.uid, 
      friendlyPix.Firebase.POSTS_PAGE_SIZE, null, true);}


    /**
     * Subscribes to receive updates to the home feed. The given `callback` function gets called for
     * each new post to the general post feed.
     *
     * If provided we'll only listen to posts that were posted after `latestPostId`.
     */ }, { key: 'subscribeToUserFeed', value: function subscribeToUserFeed(
    uid, callback, latestPostId) {
      return this._subscribeToFeed('/people/' + uid + '/posts', callback, 
      latestPostId, true);}


    /**
     * Paginates posts from the user's posts feed.
     *
     * Fetches a page of `USER_PAGE_POSTS_PAGE_SIZE` posts from the user's posts feed.
     *
     * We return a `Promise` which resolves with an Map of posts and a function to the next page or
     * `null` if there is no next page.
     */ }, { key: 'getUserFeedPosts', value: function getUserFeedPosts(
    uid) {
      return this._getPaginatedFeed('/people/' + uid + '/posts', 
      friendlyPix.Firebase.USER_PAGE_POSTS_PAGE_SIZE, null, true);}


    /**
     * Subscribes to receive updates to the given feed. The given `callback` function gets called
     * for each new entry on the given feed.
     *
     * If provided we'll only listen to entries that were posted after `latestEntryId`. This allows to
     * listen only for new feed entries after fetching existing entries using `_getPaginatedFeed()`.
     *
     * If needed the posts details can be fetched. This is useful for shallow post feeds.
     * @private
     */ }, { key: '_subscribeToFeed', value: function _subscribeToFeed(
    uri, callback) {var _this = this;var latestEntryId = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];var fetchPostDetails = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      // Load all posts information.
      var feedRef = this.database.ref(uri);
      if (latestEntryId) {
        feedRef = feedRef.orderByKey().startAt(latestEntryId);}

      feedRef.on('child_added', function (feedData) {
        if (feedData.key !== latestEntryId) {
          if (!fetchPostDetails) {
            callback(feedData.key, feedData.val());} else 
          {
            _this.database.ref('/posts/' + feedData.key).once('value').then(
            function (postData) {return callback(postData.key, postData.val());});}}});



      this.firebaseRefs.push(feedRef);}


    /**
     * Paginates entries from the given feed.
     *
     * Fetches a page of `pageSize` entries from the given feed.
     *
     * If provided we'll return entries that were posted before (and including) `earliestEntryId`.
     *
     * We return a `Promise` which resolves with an Map of entries and a function to the next page or
     * `null` if there is no next page.
     *
     * If needed the posts details can be fetched. This is useful for shallow post feeds like the user
     * home feed and the user post feed.
     * @private
     */ }, { key: '_getPaginatedFeed', value: function _getPaginatedFeed(
    uri, pageSize) {var _this2 = this;var earliestEntryId = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];var fetchPostDetails = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
      console.log('Fetching entries from', uri, 'start at', earliestEntryId, 'page size', pageSize);
      var ref = this.database.ref(uri);
      if (earliestEntryId) {
        ref = ref.orderByKey().endAt(earliestEntryId);}

      // We're fetching an additional item as a cheap way to test if there is a next page.
      return ref.limitToLast(pageSize + 1).once('value').then(function (data) {
        var entries = data.val() || {};

        // Figure out if there is a next page.
        var nextPage = null;
        var entryIds = Object.keys(entries);
        if (entryIds.length > pageSize) {(function () {
            delete entries[entryIds[0]];
            var nextPageStartingId = entryIds.shift();
            nextPage = function nextPage() {return _this2._getPaginatedFeed(
              uri, pageSize, nextPageStartingId, fetchPostDetails);};})();}

        if (fetchPostDetails) {
          // Fetch details of all posts.
          var queries = entryIds.map(function (postId) {return _this2.getPostData(postId);});
          // Since all the requests are being done one the same feed it's unlikely that a single one
          // would fail and not the others so using Promise.all() is not so risky.
          return Promise.all(queries).then(function (results) {
            var deleteOps = [];
            results.forEach(function (result) {
              if (result.val()) {
                entries[result.key] = result.val();} else 
              {
                // We encountered a deleted post. Removing permanently from the feed.
                delete entries[result.key];
                deleteOps.push(_this2.deleteFromFeed(uri, result.key));}});


            if (deleteOps.length > 0) {
              // We had to remove some deleted posts from the feed. Lets run the query again to get
              // the correct number of posts.
              return _this2._getPaginatedFeed(uri, pageSize, earliestEntryId, fetchPostDetails);}

            return { entries: entries, nextPage: nextPage };});}


        return { entries: entries, nextPage: nextPage };});}



    /**
     * Keeps the home feed populated with latest followed users' posts live.
     */ }, { key: 'startHomeFeedLiveUpdaters', value: function startHomeFeedLiveUpdaters() 
    {var _this3 = this;
      // Make sure we listen on each followed people's posts.
      var followingRef = this.database.ref('/people/' + this.auth.currentUser.uid + '/following');
      this.firebaseRefs.push(followingRef);
      followingRef.on('child_added', function (followingData) {
        // Start listening the followed user's posts to populate the home feed.
        var followedUid = followingData.key;
        var followedUserPostsRef = _this3.database.ref('/people/' + followedUid + '/posts');
        if (followingData.val() instanceof String) {
          followedUserPostsRef = followedUserPostsRef.orderByKey().startAt(followingData.val());}

        _this3.firebaseRefs.push(followedUserPostsRef);
        followedUserPostsRef.on('child_added', function (postData) {
          if (postData.key !== followingData.val()) {
            var updates = {};
            updates['/feed/' + _this3.auth.currentUser.uid + '/' + postData.key] = true;
            updates['/people/' + _this3.auth.currentUser.uid + '/following/' + followedUid] = postData.key;
            _this3.database.ref().update(updates);}});});



      // Stop listening to users we unfollow.
      followingRef.on('child_removed', function (followingData) {
        // Stop listening the followed user's posts to populate the home feed.
        var followedUserId = followingData.key;
        _this3.database.ref('/people/' + followedUserId + '/posts').off();});}



    /**
     * Updates the home feed with new followed users' posts and returns a promise once that's done.
     */ }, { key: 'updateHomeFeeds', value: function updateHomeFeeds() 
    {var _this4 = this;
      // Make sure we listen on each followed people's posts.
      var followingRef = this.database.ref('/people/' + this.auth.currentUser.uid + '/following');
      return followingRef.once('value', function (followingData) {
        // Start listening the followed user's posts to populate the home feed.
        var following = followingData.val();
        if (!following) {
          return;}

        var updateOperations = Object.keys(following).map(function (followedUid) {
          var followedUserPostsRef = _this4.database.ref('/people/' + followedUid + '/posts');
          var lastSyncedPostId = following[followedUid];
          if (lastSyncedPostId instanceof String) {
            followedUserPostsRef = followedUserPostsRef.orderByKey().startAt(lastSyncedPostId);}

          return followedUserPostsRef.once('value', function (postData) {
            var updates = {};
            if (!postData.val()) {
              return;}

            Object.keys(postData.val()).forEach(function (postId) {
              if (postId !== lastSyncedPostId) {
                updates['/feed/' + _this4.auth.currentUser.uid + '/' + postId] = true;
                updates['/people/' + _this4.auth.currentUser.uid + '/following/' + followedUid] = postId;}});


            return _this4.database.ref().update(updates);});});


        return Promise.all(updateOperations);});}



    /**
     * Returns the users which name match the given search query as a Promise.
     */ }, { key: 'searchUsers', value: function searchUsers(
    searchString, maxResults) {
      searchString = latinize(searchString).toLowerCase();
      var query = this.database.ref('/people').
      orderByChild('_search_index/full_name').startAt(searchString).
      limitToFirst(maxResults).once('value');
      var reversedQuery = this.database.ref('/people').
      orderByChild('_search_index/reversed_full_name').startAt(searchString).
      limitToFirst(maxResults).once('value');
      return Promise.all([query, reversedQuery]).then(function (results) {
        var people = {};
        // construct people from the two search queries results.
        results.forEach(function (result) {return result.forEach(function (data) {
            people[data.key] = data.val();});});


        // Remove results that do not start with the search query.
        var userIds = Object.keys(people);
        userIds.forEach(function (userId) {
          var name = people[userId]._search_index.full_name;
          var reversedName = people[userId]._search_index.reversed_full_name;
          if (!name.startsWith(searchString) && !reversedName.startsWith(searchString)) {
            delete people[userId];}});


        return people;});}



    /**
     * Saves or updates public user data in Firebase (such as image URL, display name...).
     */ }, { key: 'saveUserData', value: function saveUserData(
    imageUrl, displayName) {
      if (!displayName) {
        displayName = 'Anonymous';}

      var searchFullName = displayName.toLowerCase();
      var searchReversedFullName = searchFullName.split(' ').reverse().join(' ');
      try {
        searchFullName = latinize(searchFullName);
        searchReversedFullName = latinize(searchReversedFullName);} 
      catch (e) {
        console.error(e);}


      var updateData = { 
        profile_picture: imageUrl, 
        full_name: displayName, 
        _search_index: { 
          full_name: searchFullName, 
          reversed_full_name: searchReversedFullName } };


      return this.database.ref('people/' + this.auth.currentUser.uid).update(updateData);}


    /**
     * Fetches a single post data.
     */ }, { key: 'getPostData', value: function getPostData(
    postId) {
      return this.database.ref('/posts/' + postId).once('value');}


    /**
     * Subscribe to receive updates on a user's post like status.
     */ }, { key: 'registerToUserLike', value: function registerToUserLike(
    postId, callback) {
      // Load and listen to new Likes.
      var likesRef = this.database.ref('likes/' + postId + '/' + this.auth.currentUser.uid);
      likesRef.on('value', function (data) {return callback(!!data.val());});
      this.firebaseRefs.push(likesRef);}


    /**
     * Updates the like status of a post from the current user.
     */ }, { key: 'updateLike', value: function updateLike(
    postId, value) {
      return this.database.ref('likes/' + postId + '/' + this.auth.currentUser.uid).
      set(value ? firebase.database.ServerValue.TIMESTAMP : null);}


    /**
     * Adds a comment to a post.
     */ }, { key: 'addComment', value: function addComment(
    postId, commentText) {
      var commentObject = { 
        text: commentText, 
        timestamp: Date.now(), 
        author: { 
          uid: this.auth.currentUser.uid, 
          full_name: this.auth.currentUser.displayName, 
          profile_picture: this.auth.currentUser.photoURL } };


      return this.database.ref('comments/' + postId).push(commentObject);}


    /**
     * Uploads a new Picture to Firebase Storage and adds a new post referencing it.
     * This returns a Promise which completes with the new Post ID.
     */ }, { key: 'uploadNewPic', value: function uploadNewPic(
    pic, thumb, fileName, text) {var _this5 = this;
      // Start the pic file upload to Firebase Storage.
      var picRef = this.storage.ref(this.auth.currentUser.uid + '/full/' + Date.now() + '/' + fileName);
      var metadata = { 
        contentType: pic.type };

      var picUploadTask = picRef.put(pic, metadata).then(function (snapshot) {
        console.log('New pic uploaded. Size:', snapshot.totalBytes, 'bytes.');
        var url = snapshot.metadata.downloadURLs[0];
        console.log('File available at', url);
        return url;}).
      catch(function (error) {
        console.error('Error while uploading new pic', error);});


      // Start the thumb file upload to Firebase Storage.
      var thumbRef = this.storage.ref(this.auth.currentUser.uid + '/thumb/' + Date.now() + '/' + fileName);
      var tumbUploadTask = thumbRef.put(thumb, metadata).then(function (snapshot) {
        console.log('New thumb uploaded. Size:', snapshot.totalBytes, 'bytes.');
        var url = snapshot.metadata.downloadURLs[0];
        console.log('File available at', url);
        return url;}).
      catch(function (error) {
        console.error('Error while uploading new thumb', error);});


      return Promise.all([picUploadTask, tumbUploadTask]).then(function (urls) {
        // Once both pics and thumbanils has been uploaded add a new post in the Firebase Database and
        // to its fanned out posts lists (user's posts and home post).
        var newPostKey = _this5.database.ref('/posts').push().key;
        var update = {};
        update['/posts/' + newPostKey] = { 
          full_url: urls[0], 
          thumb_url: urls[1], 
          text: text, 
          timestamp: firebase.database.ServerValue.TIMESTAMP, 
          full_storage_uri: picRef.toString(), 
          thumb_storage_uri: thumbRef.toString(), 
          author: { 
            uid: _this5.auth.currentUser.uid, 
            full_name: _this5.auth.currentUser.displayName, 
            profile_picture: _this5.auth.currentUser.photoURL } };


        update['/people/' + _this5.auth.currentUser.uid + '/posts/' + newPostKey] = true;
        update['/feed/' + _this5.auth.currentUser.uid + '/' + newPostKey] = true;
        return _this5.database.ref().update(update).then(function () {return newPostKey;});});}



    /**
     * Follow/Unfollow a user and return a promise once that's done.
     *
     * If the user is now followed we'll add all his posts to the home feed of the follower.
     * If the user is now not followed anymore all his posts are removed from the follower home feed.
     */ }, { key: 'toggleFollowUser', value: function toggleFollowUser(
    followedUserId, follow) {var _this6 = this;
      // Add or remove posts to the user's home feed.
      return this.database.ref('/people/' + followedUserId + '/posts').once('value').then(
      function (data) {
        var updateData = {};
        var lastPostId = true;

        // Add followed user's posts to the home feed.
        data.forEach(function (post) {
          updateData['/feed/' + _this6.auth.currentUser.uid + '/' + post.key] = follow ? !!follow : null;
          lastPostId = post.key;});


        // Add followed user to the 'following' list.
        updateData['/people/' + _this6.auth.currentUser.uid + '/following/' + followedUserId] = 
        follow ? lastPostId : null;

        // Add signed-in suer to the list of followers.
        updateData['/followers/' + followedUserId + '/' + _this6.auth.currentUser.uid] = 
        follow ? !!follow : null;
        return _this6.database.ref().update(updateData);});}



    /**
     * Listens to updates on the followed status of the given user.
     */ }, { key: 'registerToFollowStatusUpdate', value: function registerToFollowStatusUpdate(
    userId, callback) {
      var followStatusRef = 
      this.database.ref('/people/' + this.auth.currentUser.uid + '/following/' + userId);
      followStatusRef.on('value', callback);
      this.firebaseRefs.push(followStatusRef);}


    /**
     * Load a single user profile information
     */ }, { key: 'loadUserProfile', value: function loadUserProfile(
    uid) {
      return this.database.ref('/people/' + uid).once('value');}


    /**
     * Listens to updates on the likes of a post and calls the callback with likes counts.
     * TODO: This won't scale if a user has a huge amount of likes. We need to keep track of a
     *       likes count instead.
     */ }, { key: 'registerForLikesCount', value: function registerForLikesCount(
    postId, likesCallback) {
      var likesRef = this.database.ref('/likes/' + postId);
      likesRef.on('value', function (data) {return likesCallback(data.numChildren());});
      this.firebaseRefs.push(likesRef);}


    /**
     * Listens to updates on the comments of a post and calls the callback with comments counts.
     */ }, { key: 'registerForCommentsCount', value: function registerForCommentsCount(
    postId, commentsCallback) {
      var commentsRef = this.database.ref('/comments/' + postId);
      commentsRef.on('value', function (data) {return commentsCallback(data.numChildren());});
      this.firebaseRefs.push(commentsRef);}


    /**
     * Listens to updates on the followers of a person and calls the callback with followers counts.
     * TODO: This won't scale if a user has a huge amount of followers. We need to keep track of a
     *       follower count instead.
     */ }, { key: 'registerForFollowersCount', value: function registerForFollowersCount(
    uid, followersCallback) {
      var followersRef = this.database.ref('/followers/' + uid);
      followersRef.on('value', function (data) {return followersCallback(data.numChildren());});
      this.firebaseRefs.push(followersRef);}


    /**
     * Listens to updates on the followed people of a person and calls the callback with its count.
     */ }, { key: 'registerForFollowingCount', value: function registerForFollowingCount(
    uid, followingCallback) {
      var followingRef = this.database.ref('/people/' + uid + '/following');
      followingRef.on('value', function (data) {return followingCallback(data.numChildren());});
      this.firebaseRefs.push(followingRef);}


    /**
     * Fetch the list of followed people's profile.
     */ }, { key: 'getFollowingProfiles', value: function getFollowingProfiles(
    uid) {var _this7 = this;
      return this.database.ref('/people/' + uid + '/following').once('value').then(function (data) {
        if (data.val()) {
          var followingUids = Object.keys(data.val());
          var fetchProfileDetailsOperations = followingUids.map(
          function (followingUid) {return _this7.loadUserProfile(followingUid);});
          return Promise.all(fetchProfileDetailsOperations).then(function (results) {
            var profiles = {};
            results.forEach(function (result) {
              if (result.val()) {
                profiles[result.key] = result.val();}});


            return profiles;});}


        return {};});}



    /**
     * Listens to updates on the user's posts and calls the callback with user posts counts.
     */ }, { key: 'registerForPostsCount', value: function registerForPostsCount(
    uid, postsCallback) {
      var userPostsRef = this.database.ref('/people/' + uid + '/posts');
      userPostsRef.on('value', function (data) {return postsCallback(data.numChildren());});
      this.firebaseRefs.push(userPostsRef);}


    /**
     * Deletes the given post from the global post feed and the user's post feed. Also deletes
     * comments, likes and the file on Firebase Storage.
     */ }, { key: 'deletePost', value: function deletePost(
    postId, picStorageUri, thumbStorageUri) {
      console.log('Deleting ' + postId);
      var updateObj = {};
      updateObj['/people/' + this.auth.currentUser.uid + '/posts/' + postId] = null;
      updateObj['/comments/' + postId] = null;
      updateObj['/likes/' + postId] = null;
      updateObj['/posts/' + postId] = null;
      updateObj['/feed/' + this.auth.currentUser.uid + '/' + postId] = null;
      var deleteFromDatabase = this.database.ref().update(updateObj);
      if (picStorageUri) {
        var deletePicFromStorage = this.storage.refFromURL(picStorageUri).delete();
        var deleteThumbFromStorage = this.storage.refFromURL(thumbStorageUri).delete();
        return Promise.all([deleteFromDatabase, deletePicFromStorage, deleteThumbFromStorage]);}

      return deleteFromDatabase;}


    /**
     * Deletes the given postId entry from the user's home feed.
     */ }, { key: 'deleteFromFeed', value: function deleteFromFeed(
    uri, postId) {
      return this.database.ref(uri + '/' + postId).remove();}


    /**
     * Listens to deletions on posts from the global feed.
     */ }, { key: 'registerForPostsDeletion', value: function registerForPostsDeletion(
    deletionCallback) {
      var postsRef = this.database.ref('/posts');
      postsRef.on('child_removed', function (data) {return deletionCallback(data.key);});
      this.firebaseRefs.push(postsRef);} }]);return _class;}();



friendlyPix.firebase = new friendlyPix.Firebase();
//# sourceMappingURL=firebase.js.map