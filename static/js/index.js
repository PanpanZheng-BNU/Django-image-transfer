function getFileName(o) {
    let pos = o.lastIndexOf("\\");
    return o.substring(pos + 1);
}

function previewAnduploadImage(image) {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function (e) {
        $("#image-preview").empty();
        $("#image-preview").removeClass("card");
        $("#image-preview").addClass("card");
        $("#image-preview").append(`
        <div class="card-header bg-info text-white">已选择图片预览</div>
        <div class="card-body"><img src=${e.target.result} width=100%/></div>`)
    }
}

$(function () {
    $("#id_image_fields").on("change", function () {
        let file = $("#id_image_fields").val();
        let fileName = getFileName(file);
        $("#id_name").val(fileName)
        previewAnduploadImage($("#id_image_fields")[0].files[0])
    })

    $("#submit").click(function () {
        var ext = $('#id_name').val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            alert('invalid extension!\n请选择gif,png,jpg,jpeg这四种类型之一的图片上传');
        } else {
            $("#transfer-image-preview").empty();
            $("#transfer-image-preview").removeClass("card");
            $("#transfer-image-preview").append(`<h3>处理中请稍候...</h3>`);

            var formData = new FormData();
            formData.append("filename", $("#id_name").val());
            formData.append("img", $("#id_image_fields")[0].files[0]);
            $.ajax({
                url: '/imageTransfer',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log(response['imgPath'])
                    $("#transfer-image-preview").empty();
                    $("#transfer-image-preview").removeClass("card");
                    $("#transfer-image-preview").addClass("card");
                    $("#transfer-image-preview").append(`
                <div class="card-header bg-secondary text-white">处理后图片预览</div>
                <div class="card-body"><img src=${response['imgPath']} width=100% /></div>`)
                }
            });
        }
    });

    $("#download").click(function () {
        if ($("#transfer-image-preview").find("img").length == 0) {
            alert('请先上传图片!');
        } else {
            let a = document.createElement('a');
            a.href = $("#transfer-image-preview img").attr("src");
            a.download = getFileName($("#transfer-image-preview img").attr("src"));
            a.click();
        }
    });

    $("html").on("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $("h1").text("失败");
        $(".upload-area").css("background-color", "#fc9999")
    });


    var lastenter = null;


    $('.upload-area').on('dragenter', function (e) {
        lastenter = e.target;
        e.stopPropagation();
        e.preventDefault();
        $("h1").text("松开鼠标选择该图片");
        $(".upload-area").css("background-color", "#FAD689")
        $('.upload-area').addClass('dragging-over');
    });
    
    $('.upload-area').on('dragstart', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".upload-area").css("background-color", "#FAD689")
        $('.upload-area').addClass('dragging-over');
    });

    $('.upload-area').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".upload-area").css("background-color", "#FAD689")
        $('.upload-area').addClass('dragging-over');
    });


    $('.upload-area').on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (lastenter === e.target) {
            $("h1").empty();
            $("h1").append("将图片拖到此区域<br/>或<br/>点击此区域上传图片");
            $(".upload-area").css("background-color", "#CCCCCC");
        }

    });

    $('.upload-area').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $("h1").text("成功");
        $(".upload-area").css("background-color", "#83CBB7")
        let file = e.originalEvent.dataTransfer.files;
        $("#id_image_fields")[0].files = file;
        $("#id_name").val(file[0].name);
        previewAnduploadImage(file[0])
    });

    $("#uploadfile").click(function () {
        $("#id_image_fields").click();
    });

})