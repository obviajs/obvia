function scorePassword(pass,strength = 40)
{
    var score = 0;
    if (!pass)
        return score;

    if(strength == 40)
        pass_length = 6;
    else if(strength == 60)
        pass_length = 8;
    else 
        pass_length = 10;

    // award every unique letter until 5 repetitions
    var letters = {};
    for (var i=0; i<pass.length; i++)
    {
        letters[pass.charAt(i)] = (letters[pass.charAt(i)] || 0) + 1;
        score += 4.9 / letters[pass.charAt(i)];
    }
    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass)
    }

    variationCount = 0;
    for (var check in variations)
    {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount) * 10;
    if(pass.length >= pass_length){
        score += 10;
        $("#character_count").css("color","green");
        $("#character_count_span").removeClass("glyphicon glyphicon-remove");
        $("#character_count_span").addClass("glyphicon glyphicon-ok");
    }else{
        $("#character_count").css("color","grey");
        $("#character_count_span").addClass("glyphicon glyphicon-remove");
    }
    if(variations['digits']){
        $("#digits_count").css("color","green");
        $("#digits_count_span").removeClass("glyphicon glyphicon-remove");
        $("#digits_count_span").addClass("glyphicon glyphicon-ok");
    }else{
        $("#digits_count").css("color","grey");
        $("#digits_count_span").addClass("glyphicon glyphicon-remove");
    }
    if(variations['lower']){
        $("#lower_count").css("color","green");
        $("#lower_count_span").removeClass("glyphicon glyphicon-remove");
        $("#lower_count_span").addClass("glyphicon glyphicon-ok");
    }else{
        $("#lower_count").css("color","grey");
        $("#lower_count_span").addClass("glyphicon glyphicon-remove");
    }
    if(variations['upper']){
        $("#upper_count").css("color","green");
        $("#upper_count_span").removeClass("glyphicon glyphicon-remove");
        $("#upper_count_span").addClass("glyphicon glyphicon-ok");
    }else{
        $("#upper_count").css("color","grey");
        $("#upper_count_span").addClass("glyphicon glyphicon-remove");
    }
    if(variations['nonWords']){
        $("#special_count").css("color","green");
        $("#special_count_span").removeClass("glyphicon glyphicon-remove");
        $("#special_count_span").addClass("glyphicon glyphicon-ok");
    }else{
        $("#special_count").css("color","grey");
        $("#special_count_span").addClass("glyphicon glyphicon-remove");
    }

    if(pass_length == 6 && score > 40){
        if(!variations['lower'] || !variations['upper'] || pass.length < 6){
            score = 39;
        }
    }
    if(pass_length == 8 && score > 60){
        if(!variations['lower'] || !variations['upper'] || !variations['digits'] || pass.length < 8){
            score = 59;
        }
    }
    if(pass_length == 10 && score > 80 ){
        if(!variations['lower'] || !variations['upper'] || !variations['digits'] || !variations['nonWords'] || pass.length < 10){
            score = 79;
        }
    }
    var message = "";
    if(score > strength ){
        $("#progres").removeClass("progress-bar-danger");
        $("#progres").addClass("progress-bar-success");
        $("#strength").css("color","green");
    }else{
        $("#progres").removeClass("progress-bar-success");
        $("#progres").addClass("progress-bar-danger");
        $("#strength").css("color","red");
    }
    if(score > 100)
        score = 100;
    $("#progres").css("width",score+"%");
    $("#progres").html(Math.floor(score)+"  "+message);
    return parseInt(score);
}
