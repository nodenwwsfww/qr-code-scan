$(function() {
    YaGames
        .init()
        .then(ysdk => {
            console.log('Yandex SDK initialized');
            window.ysdk = ysdk;

            setLocale(ysdk.environment.i18n.lang);
            console.log('Set locale', ysdk.environment.i18n.lang)
        });

/*    setTimeout(() => {
        setLocale(window.YandexGamesSDKEnvironment.i18n.lang)
    }, 0);*/

    function makeCode () {
        if ($('.qrText').val() != '') {
            var elText = document.getElementById("qr-text");

            if (!elText.value) {
                elText.focus();
                return;
            }
            console.log(elText.value)

            // Options
            var options = {
                text: elText.value,
                width: 200,
                height: 200,
            };

            $('#qrcode').empty();
            // Create QRCode Object
            new QRCode(document.getElementById("qrcode"), options);
            $('#qrcode').css('display', 'block');
            document.querySelector('.text-click-on-qr').style.display = 'block'
        }
    }

    makeCode();

    $("#generate-btn").
    on("click", function () {
        //makeCode();
        document.getElementById('qrcode-block').style.display = 'block';
        document.querySelector('#qr-text').style.display = 'none';
    })

    $('#qrcode').on('click', function() {

        var canvas = $("canvas")[0];
        var img = canvas.toDataURL("image/png");
        // window.location.href = img;
        $('.downloadCode').attr('href', img);
    });
    window.onunload = function () {
        $('#qrcode').empty();
        document.querySelector('.qrText').value = '';
    };

    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult, countResults = 0;

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            // Handle on success condition with the decoded message.
            console.log(`Scan result ${decodedText}`, decodedResult);
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);


});