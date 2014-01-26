// ==UserScript==
// @name           leprace
// @namespace      ru.whitered
// @include        http://leprosorium.ru/*
// @include        http://*.leprosorium.ru/*
// ==/UserScript==


(function($){

  addWord = function(index, data){
    console.log($('td.fow_word', data).text(), $('td.fow_to_word', data).text());
  }


  loadReplacementsPage = function(page){
    var url = "http://leprosorium.ru/fraud/textomate/" + page;
    console.log('loading', url);
    $.get(url, parseReplacements);
  }


  parseReplacements = function(data){
    words = $('table.fraud_one_word', data);
    words.each(addWord);

    scripts = $("script:not([src])", data);
    scripts.each(function(index, data){
      console.log('check script');
      md = data.innerText.match(/pag = new Paginator\('paginator', (\d+), \d+, (\d+)/);
      if(md){
        console.log('pager found');
        pagesTotal = Number(md[1]);
        currentPage = Number(md[2]);
        console.log(pagesTotal, currentPage);
        if(currentPage < pagesTotal) loadReplacementsPage(currentPage + 1);
        return;
      }
    });
  }

  loadReplacementsPage(1);


})(window.jQ);

