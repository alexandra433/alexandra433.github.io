/*
 * Name: Alexandra Hao
 * Date: Oct. 19, 2022
 * Section: AB
 *
 * This JS file allows users to play an identification game on the index.html page
 * for CP2 by clicking buttons and other elements of that page.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  /** Makes the "Try It!" button clickable */
  function init() {
    let tryButton = qs("button");
    tryButton.addEventListener("click", startGame);
  }

  /**
   * Starts the identification game by disabling the "Try It!" button, making all
   * the sections with images clickable, choosing a name to start with, and
   * adding a reset button to the page.
   */
  function startGame() {
    qs("button").disabled = true;

    let names = qsa("#images section");
    for (let i = 0; i < names.length; i++) {
      names[i].addEventListener("click", clickImage);
    }

    chooseName();
    let nameElement = id("member-name");
    nameElement.classList.remove("not-visible");

    let resetButton = gen("button");
    resetButton.textContent = "Reset";
    id("buttons").appendChild(resetButton);
    resetButton.addEventListener("click", resetGame);
  }

  /**
   * Checks whether the section the user clicked is correct. If it is, the section
   * is greyed out and a new name is chosen. If it is not correct, the counter for
   * the number of wrong clicks is increased by 1.
   * @param {HTMLElement} evt - Event object passed to the event listener.
   */
  function clickImage(evt) {
    let targetName = id("member-name").textContent.toLowerCase();
    let sectionClicked = evt.currentTarget;
    if (sectionClicked.id === targetName) {
      sectionClicked.classList.remove("unidentified");
      sectionClicked.classList.add("identified");

      let sectionText = qs("#" + targetName + " p");
      sectionText.textContent = targetName.charAt(0).toUpperCase() + targetName.substring(1);

      sectionClicked.removeEventListener("click", clickImage);
      chooseName();
    } else {
      let scoreElement = id("fails");
      let numFails = parseInt(scoreElement.textContent) + 1;
      scoreElement.textContent = numFails;
    }
  }

  /**
   * Resets the game by resetting the wrong clicks counter, returning all the
   * sections that contain images back to their original form and making them clickable.
   */
  function resetGame() {
    let names = qsa(".identified");
    for (let i = 0; i < names.length; i++) {
      names[i].classList.remove("identified");
      names[i].classList.add("unidentified");
      let sectionText = qs("#" + names[i].id + " p");
      sectionText.textContent = "???";
      names[i].addEventListener("click", clickImage);
    }
    let scoreElement = id("fails");
    scoreElement.textContent = 0;
    chooseName();
  }

  /**
   * Chooses a name of a person that has not yet been identified for the user to
   * identify.
   */
  function chooseName() {
    let names = qsa(".unidentified");
    if (names.length === 0) {
      let prompt = id("member-name");
      prompt.textContent = "That's all of them!";
    } else {
      let index = Math.floor(Math.random() * names.length);
      let chosenName = names[index].id;
      let nameElement = id("member-name");
      nameElement.textContent = chosenName.charAt(0).toUpperCase() + chosenName.substring(1);
    }
  }

  /**
   * Shortcut function from lecture for accessing an element by id.
   * @param {string} id - The id of the element.
   * @returns {HTMLElement} The html element with the given id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Shortcut function from lecture for accessing one node with a CSS selector.
   * @param {string} selector - The CSS selector for the node.
   * @returns {HTMLElement} The first html element selected by the given selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Shortcut function from lecture for accessing nodes with a CSS selector.
   * @param {string} selector - The CSS selector for the collection of nodes.
   * @returns {NodeList} A list of all the html elements selected by the given selector
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Shortcut function from lecture for creating new DOM elements.
   * @param {string} tagName - The name of the html tag.
   * @returns {HTMLElement} An empty DOM node with type tagName.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();