$(document).ready(function() {

    // 1. BANDAH 1: BINA RELOAD PAGE BADALNA (SPA + Fade-Out & Fade-In)
    $('.nav-link, .navbar-brand').click(function(e) {
        let targetId = $(this).data('target');
        if (!targetId) return;

        e.preventDefault();

        // Menu mein active class update
        $('.nav-link').removeClass('active');
        $('.nav-link[data-target="' + targetId + '"]').addClass('active');

        // Purane section ko Fade-Out aur naye ko Fade-In ke saath dikhayein
        $('.page-section:not(.d-none)').fadeOut(200, function() {
            $(this).addClass('d-none');
            $('#' + targetId).removeClass('d-none').hide().fadeIn(350);
        });

        // Mobile mein menu click karne ke baad khud band ho jaye
        $('.navbar-collapse').collapse('hide');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // 2. BANDAH 1: VISITOR COUNTER
    let visits = localStorage.getItem('bakerz_visits');
    visits = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem('bakerz_visits', visits);
    $('#visitor-count').text(visits);


    // 3. BANDAH 1: BOTTOM TICKER (Live Date, Time & Geolocation)
    let userLocation = "Fetching location...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                let lat = position.coords.latitude.toFixed(2);
                let lon = position.coords.longitude.toFixed(2);
                userLocation = `Lat: ${lat}, Lon: ${lon}`;
            },
            function() {
                userLocation = "Karachi, Pakistan";
            }
        );
    } else {
        userLocation = "Location not supported";
    }

    setInterval(function() {
        let now = new Date();
        let dateStr = now.toLocaleDateString();
        let timeStr = now.toLocaleTimeString();
        $('#ticker-content').text(`📅 Date: ${dateStr}  |  ⏰ Time: ${timeStr}  |  📍 Location: ${userLocation}  |  Welcome to Bakerz Bite - Where smiles are served daily!`);
    }, 1000);


    // 4. DATA.JSON SE PRODUCTS LOAD KARNA & CATEGORY FILTER (Bandah 3)
    let allProducts = [];

    const categoryPhotos = {
        "Cakes": [
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80"
        ],
        "Pastries & Cupcakes": [
            "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80"
        ],
        "Breads & Buns": [
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80"
        ],
        "Cookies & Biscuits": [
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80"
        ],
        "Donuts": [
            "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1631397833242-fc6213046352?auto=format&fit=crop&w=600&q=80"
        ],
        "Savory & Snacks": [
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
        ]
    };

    function displayProducts(items) {
        const container = $('#products-container');
        container.empty();

        items.forEach(item => {
            const photosList = categoryPhotos[item.category] || categoryPhotos["Cakes"];
            const safeImage = photosList[item.id % photosList.length];
            const ingredientsText = item.ingredients || "Pure Butter, Unbleached Flour, Fresh Cream, Sugar";

            const cardHtml = `
                <div class="bakery-card">
                    <div>
                        <img src="${safeImage}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';">
                        <div class="bakery-category">${item.category}</div>
                        <h5>${item.name}</h5>
                        <p>${item.description}</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="bakery-price">Rs. ${item.price}</span>
                        <button class="btn btn-sm btn-danger view-product-btn"
                            data-name="${item.name}"
                            data-price="Rs. ${item.price}"
                            data-img="${safeImage}"
                            data-desc="${item.description}"
                            data-ingredients="${ingredientsText}">
                            View Details
                        </button>
                    </div>
                </div>
            `;
            container.append(cardHtml);
        });
    }

    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(allProducts);
        })
        .catch(error => {
            console.error('Error:', error);
            $('#products-container').html('<p class="text-danger text-center">Data load nahi ho saka. VS Code Live Server use karein!</p>');
        });

    // Category Filter Click
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        const categoryName = $(this).data('category');
        if (categoryName === 'All') {
            displayProducts(allProducts);
        } else {
            const filtered = allProducts.filter(product => product.category === categoryName);
            displayProducts(filtered);
        }
    });


    // 5. PRODUCT POP-UP MODAL (Bandah 1)
    $(document).on('click', '.view-product-btn', function() {
        $('#modal-product-title').text($(this).data('name'));
        $('#modal-product-price').text($(this).data('price'));
        $('#modal-product-img').attr('src', $(this).data('img'));
        $('#modal-product-desc').text($(this).data('desc'));
        $('#modal-product-ingredients').text($(this).data('ingredients'));

        let myModal = new bootstrap.Modal(document.getElementById('productModal'));
        myModal.show();
    });


    // 6. STAR RATING & FEEDBACK FORM (Bandah 3)
    $('.star').click(function() {
        const selectedRating = $(this).data('value');
        $('#rating-value').val(selectedRating);

        $('.star').each(function() {
            if ($(this).data('value') <= selectedRating) {
                $(this).addClass('selected');
            } else {
                $(this).removeClass('selected');
            }
        });
    });

    $('#feedback-form').submit(function(e) {
        e.preventDefault();

        const name = $('#customer-name').val();
        const rating = Number($('#rating-value').val());
        const reviewText = $('#customer-review').val();

        if (rating === 0) {
            alert("Meherbani karke pehle stars select karein!");
            return;
        }

        const goldenStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        const newReview = `
            <div class="review-item">
                <div class="review-header">
                    <span>${name}</span>
                    <span class="review-stars">${goldenStars}</span>
                </div>
                <p style="margin:0; font-size:14px; color:#555;">${reviewText}</p>
            </div>
        `;

        $('#reviews-list').prepend(newReview);
        this.reset();
        $('#rating-value').val(0);
        $('.star').removeClass('selected');
    });

});