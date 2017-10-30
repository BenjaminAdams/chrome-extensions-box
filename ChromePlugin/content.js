


setTimeout(function initNyop () {
    var custEmail = null;
    var strikePrice = []
    var imgs = []
    var prodTit = []

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
        $('.prodTit').html(prodTit[index])
        $('#nyopSku').val(sku)


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

        $('.ups-title').each(function (i, obj) {
            prodTit.push(obj.innerHTML)
        });


        $('.ups-image').each(function (i, obj) {
            imgs.push(obj.innerHTML)
        });


        $('.ps-simple-price').each(function (i, obj) {
            var $btn = $('<button class="btn btn-success btn-sm nyopBtn" type="button" data-index="' + i + '"  data-price="' + prices[i] + '" data-sku="' + skus[i] + '">Name your own price</button>')
            $(obj).after($btn)
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
        var price = '<p><label for="nyopPrice">Your offer</label><input type="text" id="nyopPrice" placeholder="$"></p>'
        var email = '<p><label for="nyopEmail">Email</label><input type="text" id="nyopEmail" placeholder="email"></p>'
        var sku = '<p><input type="hidden" id="nyopSku"></p>'
        var alertChk = '<p><input type="checkbox" id="nyopAlertChk"><label for="nyopAlertChk">Also alert me when the price changes</label></p>'
        var submit = '<p><button class="btn btn-success submitNYOP" type="button">Submit</button></p>'
        var blurb = '<p><small>The <strong>name your own price feature</strong> allows you to set the price you would like to pay for this product. You will receive an order acknowledgement email stating that we have received your price match request and your order has been placed in a draft state. Once the Dell product price matches the threshold amount set by you we will complete your order. A confirmation email with product and shipping details will be sent to you in a separate email. </small></p>'
        var modalBody = '<div class="modal-body"> <div class="modalCenter"> ' + blurb + ' <div class="modalImg"></div> <div class="prodTit"></div>  <div class="strikePrice"></div> </div> ' + email + price + alertChk + sku + submit + '</div>'
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

        $('.submitNYOP').click(function () {
            var data = {
                "configItem": $('#nyopPrice').val(),
                "userEmail": $('#nyopEmail').val(),
                "setPrice": $('#nyopPrice').val(),
                "alertOnChange": $('#nyopAlertChk').is(":checked"),
            }

            $.ajax({
                type: "POST",
                url: 'http://dv1vmpmtui01.oldev.preol.dell.com:1000/PriceSet/api/values ',
                data: data,

                success: function allDone() {
                    console.log('success!')
                    alert('Success, we will email you if the price falls below your bid')
                    hideModal()
                },
                fail: function (x) {
                    alert("There was an error: " + x);
                },
                done: allDone

            });
        })


        function allDone() {
            console.log('success!')
            alert('Success, we will email you if the price falls below your bid')
            hideModal()
        }

    }


}, 150)
