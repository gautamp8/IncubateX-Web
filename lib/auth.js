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
 * Handles the user auth flows and updating the UI depending on the auth state.
 */
friendlyPix.Auth = function () {_createClass(_class, [{ key: 'waitForAuth', 

    /**
     * Returns a Promise that completes when auth is ready.
     * @return Promise
     */get: function get() 
    {
      return this._waitForAuthPromiseResolver.promise();}


    /**
     * Initializes Friendly Pix's auth.
     * Binds the auth related UI components and handles the auth flow.
     * @constructor
     */ }]);
  function _class() {var _this = this;_classCallCheck(this, _class);
    // Firebase SDK
    this.database = firebase.app().database();
    this.auth = firebase.app().auth();
    this._waitForAuthPromiseResolver = new $.Deferred();

    $(document).ready(function () {
      // Pointers to DOM Elements
      _this.signInButton = $('.fp-sign-in-button');
      var signedInUserContainer = $('.fp-signed-in-user-container');
      _this.signedInUserAvatar = $('.fp-avatar', signedInUserContainer);
      _this.signedInUsername = $('.fp-username', signedInUserContainer);
      _this.signOutButton = $('.fp-sign-out');
      _this.signedOutOnlyElements = $('.fp-signed-out-only');
      _this.signedInOnlyElements = $('.fp-signed-in-only');
      _this.usernameLink = $('.fp-usernamelink');

      // Event bindings
      _this.signOutButton.click(function () {return _this.auth.signOut();});
      _this.signedInOnlyElements.hide();});


    this.auth.onAuthStateChanged(function (user) {return _this.onAuthStateChanged(user);});}


  /**
   * Displays the signed-in user information in the UI or hides it and displays the
   * "Sign-In" button if the user isn't signed-in.
   */_createClass(_class, [{ key: 'onAuthStateChanged', value: function onAuthStateChanged(
    user) {var _this2 = this;
      if (window.friendlyPix.router) {
        window.friendlyPix.router.reloadPage();}

      this._waitForAuthPromiseResolver.resolve();
      $(document).ready(function () {
        if (!user) {
          _this2.signedOutOnlyElements.show();
          _this2.signedInOnlyElements.hide();
          _this2.userId = undefined;
          _this2.signedInUserAvatar.css('background-image', '');} else 
        {
          _this2.signedOutOnlyElements.hide();
          _this2.signedInOnlyElements.show();
          _this2.userId = user.uid;
          _this2.signedInUserAvatar.css('background-image', 'url("' + (
          user.photoURL || '/images/silhouette.jpg') + '")');
          _this2.signedInUsername.text(user.displayName || 'Anonymous');
          _this2.usernameLink.attr('href', '/user/' + user.uid);
          friendlyPix.firebase.saveUserData(user.photoURL, user.displayName);}});} }]);return _class;}();





friendlyPix.auth = new friendlyPix.Auth();
//# sourceMappingURL=auth.js.map