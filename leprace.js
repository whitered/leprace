// ==UserScript==
// @name           leprace
// @namespace      ru.whitered
// @include        http://leprosorium.ru/*
// @exclude        http://leprosorium.ru/my/inbox/*
// ==/UserScript==


(function($){

  var addWord = function(index, data){
    var from = $("td.fow_word", data).text();
    var to = $("td.fow_to_word", data).text();
    replacements.push([from, to]);
  }


  var loadReplacementsPage = function(page){
    var url = "http://leprosorium.ru/fraud/textomate/" + page;
    $.get(url, parseReplacements);
  }


  var parseReplacements = function(data){
    words = $("table.fraud_one_word", data);
    words.each(addWord);

    updatePreview();

    scripts = $("script:not([src])", data);
    scripts.each(function(index, data){
      md = data.innerText.match(/pag = new Paginator\('paginator', (\d+), \d+, (\d+)/);
      if(md){
        pagesTotal = Number(md[1]);
        currentPage = Number(md[2]);
        if(currentPage < pagesTotal) loadReplacementsPage(currentPage + 1);
        return;
      }
    });
  }


  var replace = function(text){
    var texts = [];
    var tags = [];
    var tagRegexp = /<\/?[\w]+[^>].>/;
    var pos, md, i, j;

    while((pos = text.search(tagRegexp)) >= 0) {
      texts.push(text.substr(0, pos));
      md = text.match(tagRegexp);
      tags.push(md[0]);
      text = text.substr(pos + md[0].length);
    }

    texts.push(text);

    for(j = 0; j < texts.length; j++){
      for(i = replacements.length - 1; i >= 0; i--){
        r = replacements[i];
        texts[j] = texts[j].split(r[0]).join(r[1]);
      };
    }

    text = '';
    for(i = 0; i < tags.length; i++){
      text += texts[i] + tags[i];
    }
    text += texts[texts.length - 1];
    return text;
  }

  var updatePreview = function(){
    preview.text(replace(textarea.val()));
  }

  var togglePreview = function(){
    if(preview.is(":hidden")){
      preview.slideDown("fast");
      info.text("Скрыть предпросмотр автозамен");
    } else {
      preview.slideUp("fast");
      info.text("Показать предпросмотр автозамен");
    }
    return false;
  }

  var info = $("<a href=''></a>");
  info.css('font-size', '10px');
  info.css('margin-bottom', '0.5em');
  info.css('border-bottom', '1px dashed');
  info.css('text-decoration', 'none');

  var preview = $("<div></div>");
  preview.css('font-size', '13px');
  preview.css('margin-bottom', '0.5em');
  preview.hide();

  info.click(togglePreview);
  togglePreview();

  var textarea = $("#comment_textarea");
  textarea.parent().prepend(info, preview);
  textarea.on('input propertychange', updatePreview);

  var replacements = [];

  diprf = displayInPlaceReplyForm;
  displayInPlaceReplyForm = function(replyLink, userLink){
    diprf(replyLink, userLink);
    updatePreview();
    return false;
  }


  loadReplacementsPage(1);
})(window.jQ);

