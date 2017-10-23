


setTimeout(function () {
    var custEmail = null;
    var strikePrice = []
    var imgs = []

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
        var index = target.data('index')
        console.log('sku=', sku)
        console.log('price=', price)
        $('#nyopModal').show()
        $('body').addClass('modal-open')
        $('body').append('<div class="modal-backdrop fade in"></div>')
        $('#nyopEmail').val(custEmail)
        $('.strikePrice').html(strikePrice[index])
        $('.modalImg').html(imgs[index])

        //$("#nyopSlider").val(price)
        //$("#nyopSlider").attr('max', price);
        // document.getElementById("nyopSlider").max = price
        $("#nyopPrice").val(price)
    })




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
            strikePrice.push(obj.innerHTML)
        });




        $('.ups-image').each(function (i, obj) {
            imgs.push(obj.innerHTML)
        });


        $('.ups-simple-price > .ng-scope').each(function (i, obj) {
            var $btn = $('<button class="btn btn-success btn-sm nyopBtn" type="button" data-index="' + i + '"  data-price="' + prices[i] + '" data-sku="' + skus[i] + '">Name your own price</button>')
            $(obj).after($btn)

        });

    }

    function injectModal() {
        var closeBtn = '<button type="button" class="close closeNyopModal" data-dismiss="modal" aria-hidden="true"></button>'
        var modalHeader = '<div class="modal-header">Name your own price ' + closeBtn + '</div>'
        // var slider = '<div id="slidecontainer"><input type="range" min="1" max="100" value="50" class="slider" id="nyopSlider"></div>'
        var price = '<p><label for="nyopPrice">Price</label><input type="text" id="nyopPrice" placeholder="$"></p>'
        var email = '<p><label for="nyopEmail">Email</label><input type="text" id="nyopEmail" placeholder="email"></p>'
        var modalBody = '<div class="modal-body"> <div class="modalCenter"> <div class="modalImg"></div>  <div class="strikePrice"></div> </div> ' + email + price + '</div>'
        var theModal = $('<div id="nyopModal" class="modal special-offers-modal hide-element fade in">' + modalHeader + modalBody)
        $('body').append(theModal)

        $('.closeNyopModal').click(function () {
            hideModal()
        })

        // $price = $('#nyopPrice')
        // var slider = document.getElementById("nyopSlider");
        // slider.oninput = function () {
        //     $price.val(this.value);
        // }

        window.onclick = function (event) {
            if (event.target == theModal) {
                hideModal()
            }
        }

        function hideModal() {
            $('body').removeClass('modal-open')
            theModal.hide()
            var backdrop = $('.modal-backdrop')
            backdrop.remove()
        }

    }


}, 150)
