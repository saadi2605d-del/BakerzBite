$(document).ready(function() {

    // 1. BINA RELOAD PAGE BADALNA (SPA + Fade-in)
    $('.nav-link, .navbar-brand').click(function(e) {
        e.preventDefault(); // stoping page from reloading

        // Jis link par click hua uska target naam lein (maslan 'gallery')
        let targetId = $(this).data('target');

        // Menu mein active class update (rang badalne ke liye)
        $('.nav-link').removeClass('active');
        $('.nav-link[data-target="' + targetId + '"]').addClass('active');

        // Purane section ko chupayein aur naye ko Fade-In ke saath dikhayein
        $('.page-section').addClass('d-none');
        $('#' + targetId).removeClass('d-none').hide().fadeIn(400);

        // Mobile mein menu click karne ke baad khud band ho jaye
        $('.navbar-collapse').collapse('hide');
    });


    // 2. VISITOR COUNTER
    let visits = localStorage.getItem('bakerz_visits');
    if (visits) {
        visits = parseInt(visits) + 1;
    } else {
        visits = 1;
    }
    localStorage.setItem('bakerz_visits', visits);
    $('#visitor-count').text(visits);


    // 3. BOTTOM TICKER (Live Date, Time & Geolocation)
    let userLocation = "Fetching location...";

    // HTML5 Geolocation se location lena
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                let lat = position.coords.latitude.toFixed(2);
                let lon = position.coords.longitude.toFixed(2);
                userLocation = `Lat: ${lat}, Lon: ${lon}`;
            },
            function() {
                // Agar user location block kar de
                userLocation = "Karachi, Pakistan";
            }
        );
    } else {
        userLocation = "Location not supported";
    }

    // Har second baad Date aur Time update
    setInterval(function() {
        let now = new Date();
        let dateStr = now.toLocaleDateString();
        let timeStr = now.toLocaleTimeString();
        
        $('#ticker-content').text(`📅 Date: ${dateStr}  |  ⏰ Time: ${timeStr}  |  📍 Location: ${userLocation}  |  Welcome to Bakerz Bite - Where smiles are served daily!`);
    }, 1000);


    // 4. PRODUCT POP-UP MODAL (Jab kisi cake/cookie/item par click ho)
    $(document).on('click', '.view-product-btn', function() {
        // Jis product par click hua, uski maloomat uthayein
        let name = $(this).data('name');
        let price = $(this).data('price');
        let img = $(this).data('img');
        let desc = $(this).data('desc');
        let ingredients = $(this).data('ingredients');

        // Pop-up (Modal) ke andar ye maloomat bhar dein
        $('#modal-product-title').text(name);
        $('#modal-product-price').text(price);
        $('#modal-product-img').attr('src', img);
        $('#modal-product-desc').text(desc);
        $('#modal-product-ingredients').text(ingredients);

        // Bootstrap Modal ko screen par khol dein
        let myModal = new bootstrap.Modal(document.getElementById('productModal'));
        myModal.show();
    });

});