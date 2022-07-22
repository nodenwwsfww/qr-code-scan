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

    // makeCode();


    window.onunload = function () {
        $('#qrcode').empty();
        document.querySelector('.qrText').value = '';
    };



    const requestCameraBtn = () => document.getElementById('qr-reader__camera_permission_button')
    const scanBtn = () => document.getElementById('qr-reader__dashboard_section_swaplink');
    const browseImgBtn = () => document.getElementById('qr-reader__filescan_input');
    const backArrowCamera = () => document.querySelector('.back-arrow-camera');
    const qrCodeBlock = document.getElementById('qrcode-block');
    const qrCodeContainer = () => document.getElementById('qrcode-container');
    const folderBehaviour = document.getElementById('folder-behaviour');
    const folderBar = document.querySelector('#folder-bar');
    const cameraBar = document.querySelector('#camera-bar');

    const stopScanningBtn = () => document.querySelectorAll('#qr-reader__dashboard_section_csr>span>button')[1];
    let checkInterval;
    let currentBackArrow;

    //const resultContainer = document.getElementById('qr-reader-results');

    function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        //resultContainer.style.display = 'flex';
        //console.log(`Code matched = ${decodedText}`, decodedResult);
    }

    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        //console.warn(`Code scan error = ${error}`);
    }

    function initQrScanner() {
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: {width: 600, height: 250} },
            /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        window.qrScanner = html5QrcodeScanner
    }


    function requestCameraPermissions() {
        const clickEvent = new Event('click')
        requestCameraBtn().dispatchEvent(clickEvent);
        hideExtraSelectCameraText();
        backArrowCamera().style.display = 'flex';
        const dashBoard = document.getElementById("qr-reader__dashboard");
        //backArrowCamera().closest('div').insertAdjacentHTML('beforebegin', backArrowCamera().innerHTML);
        dashBoard.appendChild(backArrowCamera());
        backArrowCamera().style.marginLeft = '25%';

        const startScanningBtn = document.querySelector('button[textContent="Start Scanning"]');

        console.log('add event listener')

        //if (startScanningBtn) startScanningBtn.dispatchEvent(clickEvent);
    }

    window.requestCameraPermissions = requestCameraPermissions;

    function scanImage() {
        const clickMouseEvent = new MouseEvent('click', {bubbles: true});
        $('input[type=file]').change(function () {
            const outputFileName = document.getElementById('qr-text');
            outputFileName.value = this.files[0].name;
        });
        scanBtn().dispatchEvent(clickMouseEvent);
        browseImgBtn().dispatchEvent(clickMouseEvent);

    }

    window.scanImage = scanImage;

    const hideExtraSelectCameraText = () => {
        const spanWithSelectCamera = document.querySelector('#qr-reader__dashboard_section_csr>span');
        if (spanWithSelectCamera && spanWithSelectCamera.textContent.includes('Select Camera')) {
            spanWithSelectCamera.innerHTML = spanWithSelectCamera.innerHTML.replace('Select Camera (2)', '');
        }
    };

    const toggleExtra = () => {
        cameraBar.style.display = 'none';
        folderBar.style.display = 'none';
        if (requestCameraBtn()) requestCameraBtn().style.display = 'none';
        if (scanBtn()) scanBtn().style.display = 'none';
        hideExtraSelectCameraText();
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

    const hideSelectImageExtraField = () => {
        try {
            const span = document.querySelector('#qr-reader__dashboard_section_fsr>span')
            if (span && span.textContent.includes("Select Image")) span.style.display = 'none';
        } catch(e) {

        }
    }

    // folder
    $("#generate-btn").
    on("click", function () {
        scanImage();
    })

    folderBar.addEventListener('click', () => {
        try {
            toggleExtra();
            folderBehaviour.style.display = 'flex'
            qrCodeContainer().style.display = 'none';
            //scanImage();
        } catch(error) {
            //console.error(error)
        }
        checkInterval = setInterval(() => {
            hideImgAdv();
            hideSelectImageExtraField();
        }, 100);
    });
    cameraBar.addEventListener('click', () => {
        console.log('click')
        try {
            folderBehaviour.style.display = 'none'
            qrCodeContainer().style.display = 'flex';
            toggleExtra();
            document.querySelector('#root').style.display = 'none';
            requestCameraPermissions();
        } catch(error) {
            //console.error(error)
        }
        console.log('start interval')
        checkInterval = setInterval(() => {
            hideImgAdv();
            hideExtraSelectCameraText();
            if (document.getElementById('qr-reader__dashboard_section_csr')) document.getElementById('qr-reader__dashboard_section_csr').style.display = 'none'
            if (document.querySelector('video')) {
                document.querySelector('#root').style.display = 'block';
                document.querySelector('video').style.width = '600px';

                backArrowCamera().onclick = function (e) {
                    const clickMouseEvent = new MouseEvent('click', {bubbles: true});
                    stopScanningBtn().dispatchEvent(clickMouseEvent);
                }

                stopScanningBtn().onclick = function (e) {
                    console.log(e.target)
                    if (e.target.textContent == 'Stop Scanning') {
                        console.log('click event')
                        clearInterval(checkInterval);
                        document.querySelector('#root').style.display = 'block'

                        window.qrScanner.clear();
                        cameraBar.style.display = 'flex';
                        folderBar.style.display = 'flex';
                        initQrScanner();
                        document.querySelector('.container').style.display = 'none'
                        //scanImage();
                    }
                };
            } else {
                document.querySelector('#root').style.display = 'none';
            }
        }, 20);
    });
    initQrScanner();

});