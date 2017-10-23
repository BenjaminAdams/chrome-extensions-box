


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
        var parent = target.parent()
        var parent2 = parent.parent()
    })


}, 150)


function addBtns() {
    var $btn = $('<button class="btn btn-success btn-sm nyopBtn" type="button">Name your own price</button>')
    $('.ups-simple-price > .ng-scope').after($btn)
    // $btn.click(showPopup)
}

function showPopup() {
    alert('yay')
    // $("#nyopModal").modal("show");
}

function injectModal() {

}


