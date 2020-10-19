const keywordSet = new Set();

// load data
$.get("data/page-1.json")
    .then((data) => {
        data.forEach(({ image_url, title, description, keyword, horns }) => {
            const image = new Image(image_url, title, description, keyword, horns);
            image.render();
            keywordSet.add(keyword);
        });
    }).then(() => {
        // remove the template after render all of items
        $("#template").remove();
    }).then(() => {
        // render options set
        keywordSet.forEach((keyword) => {
            $("select").append(`<option>${keyword}</option>`)
        })
    })

// event listener
$("select").change((option) => {
    const selectedKeyword = option.target.value;
    if (selectedKeyword !== "default") {
        // hide all elements
        $(".Image").hide();
        $(`.${selectedKeyword}`).show();
    } else {
        $(".Image").show();
    }
})

function Image(image_url, title, description, keyword, horns) {
    this.image_url = image_url;
    this.title = title;
    this.description = description;
    this.keyword = keyword;
    this.horns = horns;
}


Image.prototype.render = function() {
    const template = $("#template").clone();
    template.removeAttr("id");
    template.addClass(this.keyword);
    template.find("img").attr("src", this.image_url);
    template.find(".desc").text(this.description);
    $("#divContainer").append(template);
}