(function (context) {
    KxRequest
        .promise(
            $.ajax({
                type: "POST",
                url: "http://flower/?api",
                dataType: "json",
                data: {
                    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmbG93ZXIiLCJhdWQiOiJmbG93ZXIiLCJpYXQiOjE1MjA5NTA2MzksIm5iZiI6MTUyMDk1MDY0OSwiZXhwIjozMDQ0NDg5Njc4LCJkYXRhIjp7InVzZXJfaWQiOiIxIn19.GiUTz8vlbKP_qDvg9nRSsJw0PmO_AzBSkhiaaU3b9y4',
                    resource: '?processTasksCRUD/view_detail/116/203'
                },
            })
        )
        .done(function (response) {
            var props = response.data;
            props.components.forEach(function (component) {
                component.constructor = eval(component.constructor)
            });

            var myForm = new Form(props);

            myForm.on('endDraw', function () {
                loader.hide();
            });

            $('#root').append(await myForm.render().$el);

            context["myForm"] = myForm;
        });
})(this)