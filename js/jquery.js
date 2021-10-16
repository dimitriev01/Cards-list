  //прозрачность экрана в момент загрузки json
  $(document).ajaxSend(function(event, request, settings) {
    $('.loading-indicator').show();
    $('.loading-indicator').css('opacity','1');
    $('body').css('opacity','.3');
  });

  $(document).ajaxComplete(function(event, request, settings) {
    $('.loading-indicator').hide();
    $('body').css('opacity','1');
  });

  // 
  $(document).ready(function()
  {
    function showNewCards(data){
      $(`.card-item`).hide("fast");
      $(`.card-item`).remove();
        let pathImg;
        const urlSite = 'http://contest.elecard.ru/frontend_data/';
        let fullpath;
        let countImg = 0;

        $.each(data, function(key, val){ 
          countImg++;
          pathImg = val.image;
          fullpath = urlSite + pathImg;

          //появление картинок в cards
          $(".cards").append(`<div class="card-item num-${countImg}"></div>`);
          $(`.cards .num-${countImg}`).append('<i title="Удалить" class="far fa-times-circle"></i><img>');
          $(`.cards .num-${countImg} img`).attr("src", fullpath);
        });
    }

    $.getJSON('http://contest.elecard.ru/frontend_data/catalog.json', 
    function(data)
    {
      let pathImg;
      const urlSite = 'http://contest.elecard.ru/frontend_data/';
      let fullpath;
      let countImg = 0;

      let deletedImages = $.cookie('deletedImages') ? $.parseJSON($.cookie('deletedImages')) : [];

      $.each(data, function(key, val)
      { 
        countImg++;
        pathImg = val.image;
        fullpath = urlSite + pathImg;

        //появление картинок в cards
        $(".cards").append(`<div class="card-item num-${countImg}"></div>`);
        $(`.cards .num-${countImg}`).append('<i title="Удалить" class="far fa-times-circle"></i><img>');
        $(`.cards .num-${countImg} img`).attr("src", fullpath).addClass("image");

        if (deletedImages.includes(fullpath)) {
          $(`.num-${countImg}`).hide();
        }

           if ( !$('.list__ul.main').children().length) {
            $('.list__ul.main').text("ROOT");
           }
           let objProps = [];

           for (key in data[0])
              objProps.push(key);

           $('.list__ul.main').append(`
            <ul class="nested-list num-${countImg}">
              <i class="far fa-minus-square"></i>
              <i class="far fa-plus-square"></i>
            <a>${countImg} Child</a></ul>`);

          let fullpathHover;
          let elem = countImg;
          fullpathHover = fullpath; 
          $(`.list__ul .nested-list.num-${countImg}`).append(`            
              <li class="linkImg">${objProps[0]} : <a title="Открыть картинку в новой вкладке" class="a_item"><img class="image-hover"></a></li> 
              <li>${objProps[1]} : ${val.filesize}</li> 
              <li>${objProps[2]} : ${val.timestamp}</li> 
              <li>${objProps[3]} : ${val.category}</li> `);
           $(`.list__ul .num-${countImg} .a_item`).attr("href", fullpath);

           // скрыть вложенные li
           $(".list__ul .nested-list li").hide();
         
          $(`.list__ul .num-${elem} img`).attr("src", fullpathHover);

          let opened = false;
          function turnNestedlist()
          {
            elem = countImg;
           
            $(`.list__ul .nested-list.num-${elem}`).click(function()
            {
              if (!$(this).hasClass('active') && !opened)
              {
                $(this).addClass('active');
                opened = true;
                $(this).children('li').show("fast");
              }
              else
              {
                $(this).removeClass('active');
                opened = false;
                $(this).children('li').hide("fast");
              }          
            }); 
          }
         turnNestedlist();
      });

      function hideCurrentImg(){
        //скрыть картинку из card
        $(".card-item .far.fa-times-circle").click(function(){
          let cardItem = $(this).closest(".card-item");
          cardItem.hide("fast");

          // MARK: - Сохраняем удаленное изображение в куки
          let deletedImages = [];
          let DeletedImagesCookie = $.cookie('deletedImages');
          
          if (DeletedImagesCookie) 
            deletedImages = $.parseJSON(DeletedImagesCookie);

          let imageURL = cardItem.children().last().attr("src");
          deletedImages.push(imageURL);
          $.cookie('deletedImages', JSON.stringify(deletedImages));
        });
      }
      hideCurrentImg();

      $('.header .header__switch--cards').click(function(){
        $('.header .header-btn,.footer__sort-inner').show("fast");
      });

      $('.header .header__switch--list').click(function(){
        $('.header .header-btn,.footer__sort-inner').hide("fast");
      });


    function sortByName(){
      data.sort(function(a,b){
        return a.image.localeCompare(b.image);
      });
      showNewCards(data);
      hideCurrentImg();
    }
    $('.sort_name').click(sortByName);


    function sortBySize() {
       data.sort((lv,rv) => lv.filesize - rv.filesize);
       showNewCards(data);
       hideCurrentImg();
    }
    $('.sort_size').click(sortBySize);

    function sortByStamp() {
      data.sort((lv,rv) => lv.timestamp - rv.timestamp);
      showNewCards(data);
      hideCurrentImg();
    }
    $('.sort_stamp').click(sortByStamp);

    function sortByCategory(){
      data.sort((lv,rv) => lv.category.localeCompare(rv.category));
      showNewCards(data);
      hideCurrentImg();
    }
    $('.sort_category').click(sortByCategory);


  }); /*function(data)*/

    $('.list__ul').hide();

    function showCards(){
      if ($('.header__switch--cards').is(':checked')){
        $('.list__ul').hide("slow");
        $('.cards').show("slow");
      }
    }
    $('.header__switch--cards').click(showCards);

    function showList(){
      if ($('.header__switch--list').is(':checked')){
       $('.cards').hide("slow");
       $('.list__ul').show("slow");
      } 
    }
    $('.header__switch--list').click(showList);

    function clearAllImages(){
      $(".cards").hide("fast");
    }
    $(".clear__cards").click(clearAllImages);


    function ShowAllImages(){
      $.removeCookie('deletedImages');
      $(".card-item").show("fast");
      $(".cards").show("fast");
    }
    $(".show__cards").click(ShowAllImages);

    $('.header__switch--cards').click(function(){
      $('.footer').css('height','auto');
    });

}); /*ready*/
