
function startIntro(){
    //data
    var data;
    var url = window.location.href;
    url = url.split("/?")[1];

    //skip event
    $(document).on('click', '.introjs-skipbutton', function(){
        $.ajax({
            url: "?intro_tour/hideIntro",
            type: 'post',
            success: function(response)
            {
                //window.location.href = '?main_task/feed_trouble_ticket';
            }
        });
    });

    $.ajax({
        url: "?intro_tour/intro_tour",
        type: 'post',
        dataType: 'json',
        data: {url: url},

        success: function(response)
        {
            if(response == 'watched')
            {
                return;
            }
            data = response;

            for(step in data)
            {
                data[step].element = eval(data[step].element);
            }
            //console.log(data);

            //intro
            var intro = introJs();
            intro.setOptions({
                steps:data,
                nextLabel: " Vazhdo > ",
                prevLabel: " < Prapa ",
                skipLabel: "Mos e trego me",
                doneLabel: "Perfundo",
                hidePrev: true,
                hideNext: true,
                showBullets: false,
                showProgress: false,
                showStepNumbers: true,
                scrollToElement: false,
                overlayOpacity: 0.3
            });
            intro.start();

        }
    });

}
startIntro();