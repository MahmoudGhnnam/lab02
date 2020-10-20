const keywordSet = new Set();

const dataSource = window.location.href.endsWith("index.html") ? "data/page-1.json" : "data/page-2.json";


function Image(image_url, title, description, keyword, horns) {
    this.image_url = image_url;
    this.title = title;
    this.description = description;
    this.keyword = keyword;
    this.horns = horns;
    Image.Array.push(this);
}
Image.Array = [];

Image.prototype.render = function () {
    const template = $("#template").clone();
    template.removeAttr("id");
    template.addClass(this.keyword);
    template.find("img").attr("src", this.image_url);
    template.find(".desc").text(this.description);
    $("#divContainer").append(template);
}


Image.prototype.toHtml = function () {
    let mustachTemplate = $("#image-template").html();
    let newObject = Mustache.render(mustachTemplate, this);
    $("#divContainer").append(newObject);
}

// load data
$.get(dataSource)
    .then((data) => {
        data.forEach(({ image_url, title, description, keyword, horns }) => {
            const image = new Image(image_url, title, description, keyword, horns);
            //    image.render();
            image.toHtml();
            keywordSet.add(keyword);
        });
    }).then(() => {
        // remove the template after render all of items
        $("#template").remove();
    }).then(() => {
        // render options set
        keywordSet.forEach((keyword) => {
            $("#filter").append(`<option>${keyword}</option>`)
        })
    })

// event listener
$("#filter").change((option) => {
    const selectedKeyword = option.target.value;
    if (selectedKeyword !== "default") {
        // hide all elements
        $(".Image").hide();
        $(`.${selectedKeyword}`).show();
    } else {
        $(".Image").show();
    }
})

$("#horons").change((option) => {
    const selectedSort = option.target.value; // can be title or horons
    if (selectedSort === "title") {
        Image.Array.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
    } else if (selectedSort === "horns") {
        Image.Array.sort((a, b) => {
            return a.horns - b.horns;
        });
    }

    $("#divContainer").html("");
    Image.Array.forEach((image) => {
        image.toHtml();
    })
})