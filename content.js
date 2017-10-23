


setTimeout(function () {
    var custEmail = null;

    // var $btn = $('<button class="btn btn-success btn-block" type="button">Name your own Price</button>')
    // $('.continueButton').after($btn)

    addBtns()
    injectModal()

    // window.postMessage({ type: "FROM_PAGE", text: window.embeddedDataModel.PersonalizationDataModel.SavedCartDataModel.UserEmail }, "*");
    function sendMessage() {
        window.postMessage({ type: "FROM_PAGE", text: userContext.Email }, "*");
    }
    location.href = "javascript:(" + sendMessage.toString() + ")()";


    window.addEventListener("message", function (event) {
        if (event.source != window)
            return;

        if (event.data.type && (event.data.type == "FROM_PAGE")) {
            custEmail = event.data.text
            console.log('custEmail=', custEmail)

        }
    }, false);


    $('.nyopBtn').click(function (e) {
        var target = $(e.currentTarget)
        var sku = target.data('sku')
        var price = target.data('price').replace('$', '')
        console.log('sku=', sku)
        console.log('price=', price)
        $('#nyopModal').show()
        $('#nyopEmail').val(custEmail)
        $("#nyopSlider").val(price)
        $("#nyopSlider").attr('max', price);
        document.getElementById("nyopSlider").max = price
        $("#nyopPrice").val(price)
    })


}, 150)


function addBtns() {

    var skus = []
    var prices = []

    $('.ups-evaluecode').each(function (i, obj) {
        var txt = obj.innerText
        var split = txt.split(' ')
        if (!split) return console.log('could not find a sku from txt ' + txt)
        var sku = split[split.length - 1]
        skus.push(sku)
    });


    $('.ups-simple-price').each(function (i, obj) {
        var txt = obj.innerText
        var split = txt.split(' ')
        if (!split) return console.log('could not find a price from txt ' + txt)
        var price = split[split.length - 1]
        prices.push(price)
    });


    $('.ups-simple-price > .ng-scope').each(function (i, obj) {
        var $btn = $('<button class="btn btn-success btn-sm nyopBtn" type="button" data-price="' + prices[i] + '" data-sku="' + skus[i] + '">Name your own price</button>')
        $(obj).after($btn)

    });

    //var $btn = $('<button class="btn btn-success btn-sm nyopBtn" type="button">Name your own price</button>')
    // $('.ups-simple-price > .ng-scope').after($btn)
    // $btn.click(showPopup)
}

function showPopup() {
    alert('yay')
    // $("#nyopModal").modal("show");
}

function injectModal() {
    var closeBtn = '<button type="button" class="close closeNyopModal" data-dismiss="modal" aria-hidden="true"></button>'
    var modalHeader = '<div class="modal-header">Name your own price ' + closeBtn + '</div>'
    var slider = '<div id="slidecontainer"><input type="range" min="1" max="100" value="50" class="slider" id="nyopSlider"></div>'
    var price = '<p><label for="nyopPrice">Price</label><input type="text" id="nyopPrice" placeholder="$"></p>'
    var email = '<p><label for="nyopEmail">Email</label><input type="text" id="nyopEmail" placeholder="email"></p>'
    var modalBody = '<div class="modal-body">' + email + slider + price + '</div>'
    var theModal = $('<div id="nyopModal" class="modal special-offers-modal hide-element fade in">' + modalHeader + modalBody)
    $('body').append(theModal)

    $('.closeNyopModal').click(function () {
        theModal.hide()
    })

    $price = $('#nyopPrice')

    var slider = document.getElementById("nyopSlider");
    slider.oninput = function () {
        $price.val(this.value);
    }

    window.onclick = function (event) {
        if (event.target == theModal) {
            theModal.hide()
        }
    }


}


