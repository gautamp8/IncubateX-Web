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
 * Handles the pages/routing.
 */
friendlyPix.Router = function () {

  /**
   * Initializes the Friendly Pix controller/router.
   * @constructor
   */
  function _class() {var _this = this;_classCallCheck(this, _class);
    $(document).ready(function () {
      friendlyPix.auth.waitForAuth.then(function () {
        // Dom elements.
        _this.pagesElements = $('[id^=page-]');
        _this.splashLogin = $('#login', '#page-splash');

        // Make sure /add is never opened on website load.
        if (window.location.pathname === '/add') {
          page('/');}


        // Configuring routes.
        var pipe = friendlyPix.Router.pipe;
        var displayPage = _this.displayPage.bind(_this);
        var loadUser = function loadUser(userId) {return friendlyPix.userPage.loadUser(userId);};
        var showHomeFeed = function showHomeFeed() {return friendlyPix.feed.showHomeFeed();};
        var showGeneralFeed = function showGeneralFeed() {return friendlyPix.feed.showGeneralFeed();};
        var clearFeed = function clearFeed() {return friendlyPix.feed.clear();};
        var showPost = function showPost(postId) {return friendlyPix.post.loadPost(postId);};

        page('/', pipe(showHomeFeed, null, true), 
        pipe(displayPage, { pageId: 'feed', onlyAuthed: true }));
        page('/feed', pipe(showGeneralFeed, null, true), pipe(displayPage, { pageId: 'feed' }));
        page('/post/:postId', pipe(showPost, null, true), pipe(displayPage, { pageId: 'post' }));
        page('/user/:userId', pipe(loadUser, null, true), pipe(displayPage, { pageId: 'user-info' }));
        page('/about', pipe(clearFeed, null, true), pipe(displayPage, { pageId: 'about' }));
        page('/add', pipe(displayPage, { pageId: 'add', onlyAuthed: true }));
        page('*', function () {return page('/');});

        // Start routing.
        page();});});}




  /**
   * Returns a function that displays the given page and hides the other ones.
   * if `onlyAuthed` is set to true then the splash page will be displayed instead of the page if
   * the user is not signed-in.
   */_createClass(_class, [{ key: 'displayPage', value: function displayPage(
    attributes, context) {
      var onlyAuthed = attributes.onlyAuthed;
      var pageId = attributes.pageId;

      if (onlyAuthed && !firebase.app().auth().currentUser) {
        pageId = 'splash';
        this.splashLogin.show();}

      friendlyPix.Router.setLinkAsActive(context.canonicalPath);
      this.pagesElements.each(function (index, element) {
        if (element.id === 'page-' + pageId) {
          $(element).show();} else 
        if (element.id === 'page-splash') {
          $(element).fadeOut(1000);} else 
        {
          $(element).hide();}});


      friendlyPix.MaterialUtils.closeDrawer();
      friendlyPix.Router.scrollToTop();}


    /**
     * Reloads the current page.
     */ }, { key: 'reloadPage', value: function reloadPage() 
    {
      var path = window.location.pathname;
      if (path === '') {
        path = '/';}

      page(path);}


    /**
     * Scrolls the page to top.
     */ }], [{ key: 'scrollToTop', value: function scrollToTop() 
    {
      $('html,body').animate({ scrollTop: 0 }, 0);}


    /**
     * Pipes the given function and passes the given attribute and Page.js context.
     * Set 'optContinue' to true if there are further functions to call.
     */ }, { key: 'pipe', value: function pipe(
    funct, attribute, optContinue) {
      return function (context, next) {
        if (funct) {
          var params = Object.keys(context.params);
          if (!attribute && params.length > 0) {
            funct(context.params[params[0]], context);} else 
          {
            funct(attribute, context);}}


        if (optContinue) {
          next();}};}




    /**
     * Highlights the correct menu item/link.
     */ }, { key: 'setLinkAsActive', value: function setLinkAsActive(
    canonicalPath) {
      if (canonicalPath === '') {
        canonicalPath = '/';}

      $('.is-active').removeClass('is-active');
      $('[href="' + canonicalPath + '"]').addClass('is-active');} }]);return _class;}();



friendlyPix.router = new friendlyPix.Router();
//# sourceMappingURL=routing.js.map