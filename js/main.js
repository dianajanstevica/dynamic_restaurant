const modal = document.querySelector(".modal-background");
modal.addEventListener("click", () => {
    modal.classList.add("hide");
});

fetch("https://kea-alt-del.dk/t5/api/categories")
    .then(res => res.json())
    .then(function (data) {
        data.forEach(buildCategory)
        getProducts();
    })

function buildCategory(data) {
    const section = document.createElement("section");
    const header = document.createElement("h1");
    header.textContent = data;
    section.setAttribute("id", data)
    section.appendChild(header);
    document.querySelector("main").appendChild(section);
    console.log(data)
}

function getProducts() {
    fetch("https://kea-alt-del.dk/t5/api/productlist").then(function (response) {
        return response.json()
    }).then(function (data) {
        data.forEach(showDish)
    })
}

function showDish(dish) {
    console.log(dish);
    const template = document.querySelector("template").content;
    const copy = template.cloneNode(true);
    copy.querySelector(".name").textContent = dish.name;

    copy.querySelector(".price").textContent = `${dish.price},-`;
    if (dish.discount) {
        copy.querySelector(".price").classList.add(".discount");
        copy.querySelector(".discount").textContent = `${Math.round(dish.price - dish.discount / 100 * dish.price)},-`
    } else {
        copy.querySelector(".discount").remove()
    }

    copy.querySelector(".description").textContent = dish.shortdescription;

    copy.querySelector(".alcohol").textContent = `Alcohol: ${dish.alcohol}%`;

    copy.querySelector(".veg").textContent = dish.vegetarian;
    if (dish.vegetarian) {
        copy.querySelector(".veg").textContent = `Vegetarian: Yes`;
    } else {
        copy.querySelector(".veg").textContent = `Vegetarian: No`;
    }



    console.log(copy.querySelector(".imgsmall"));
    copy.querySelector(".imgsmall").src = `../static_restaurant/images/small/${dish.image}-sm.jpg`;


    if(dish.soldout){
       console.log(dish.soldout); copy.querySelector(".imgsmall").classList.toggle("soldout");
    copy.querySelector(".soldout_img").classList.remove("d-none");
    }

    copy.querySelector("button").addEventListener("click", () => {
        fetch(`https://kea-alt-del.dk/t5/api/product?id=${dish.id}`)
            .then(res => res.json())
            .then(showDetails);


    });


//    const link = document.createElement("a");






    document.querySelector(`#${dish.category}`).appendChild(copy);

}



function showDetails(data) {
    console.log(data);
    modal.querySelector(".modal-name").textContent = data.name;
    modal.querySelector(".modal-description").textContent = data.longdescription;


    modal.querySelector(".modal-price").textContent = `${data.price},-`;
    if (data.discount) {
        modal.querySelector(".modal-price").classList.add("modal-discount");

        modal.querySelector(".modal-discount").textContent = `${Math.round(data.price - data.discount / 100 * data.price)},-`;

    } else {
        modal.querySelector(".modal-price").textContent = `${data.price},-`;
    };

    modal.querySelector(".modal-allergens").textContent = data.allergens;
    if(data.allergens < 1){
        modal.querySelector(".modal-allergens").style.hidden;
    } else {
    modal.querySelector(".modal-allergens").textContent = `Allergens: ${data.allergens}`;
    };

    console.log(modal.querySelector(".modal-image"));
    modal.querySelector(".modal-image").src = `../static_restaurant/images/small/${data.image}-sm.jpg`;





    modal.classList.remove("hide");
}
