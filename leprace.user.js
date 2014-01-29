// ==UserScript==
// @name           leprace
// @namespace      ru.whitered
// @include        http://leprosorium.ru/*
// @exclude        http://leprosorium.ru/my/inbox/*
// ==/UserScript==


function includeScript() {
  var s = document.createElement("script");
  s.src = "https://raw.github.com/whitered/leprace/master/leprace.js";
  document.body.appendChild(s);
}

includeScript();
