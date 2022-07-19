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
        // document.getElementById('qrcode-block').style.display = 'block';
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


    const requestCameraBtn = document.getElementById('qr-reader__camera_permission_button')
    const scanBtn = document.getElementById('qr-reader__dashboard_section_swaplink')
    const qrCodeBlock = document.getElementById('qrcode-block');
    const qrCodeContainer = document.getElementById('qrcode-container');
    const folderBar = document.querySelector('#folder-bar');
    const cameraBar = document.querySelector('#camera-bar');
    let checkInterval;


    function requestCameraPermissions() {
        const clickEvent = new Event('click')
        requestCameraBtn.dispatchEvent(clickEvent);
    }

    window.requestCameraPermissions = requestCameraPermissions;

    function scanImage() {
        const clickEvent = new Event('click')
        scanBtn.dispatchEvent(clickEvent);
    }

    window.scanImage = scanImage;

    const clickHideCallback = () => {
        cameraBar.style.display = 'none'
        folderBar.style.display = 'none'
        qrCodeContainer.style.display = 'flex'
    };
    const hideImgAdv = () => {
        try {
            const imgAdv = [...document.querySelectorAll('img')].filter(img => {
                return img.alt.includes("Info")
            })[0];
            if (imgAdv) imgAdv.style.display = 'none';
        } catch (error) {

        }
    };

    folderBar.addEventListener('click', () => {
        clickHideCallback();
        scanImage();
        checkInterval = setInterval(() => {
            hideImgAdv();
            document.getElementById('qr-reader__camera_permission_button').style.display = 'none';
        }, 50);
    });
    cameraBar.addEventListener('click', () => {
        console.log('click')
        clickHideCallback();
        try {
            requestCameraPermissions();
        } catch(error) {
            //console.error(error)
        }
        console.log('start interval')
        checkInterval = setInterval(() => {
            hideImgAdv();
            document.getElementById('qr-reader__dashboard_section_swaplink').style.display = 'none';
        }, 50);
    });

});