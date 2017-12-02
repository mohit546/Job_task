$(document).ready(function() {
    var currentModalImage = null;
    var activeClass = ' class="active"';

    $.ajax({
        dataType: "json",
        url: './data.json',
        success: function(response) {
            displayContentsOnViewport(response);
        }
    });

    function displayContentsOnViewport(data) {
        var template = '<ul class="nav nav-tabs">';
        var tabContents = null;
        for (var i = 0, l = data.length; i < l; i++) {
            if (data[i].active) { // if current tab is active add content and images
                template = template + '<li role="presentation"' + activeClass + '><a href="#" class="tabs" data-id="' + "tab-" + i + '">' + data[i].name + '</a></li>';
                if (data[i].content.length && data[i].images.length) { //if content and images available
                    tabContents = '<div class="row"><div class="col-sm-8">' + createContentHtml(data, i) + '</div><div class="col-sm-4">' + createImageHtml(data, i) + '</div></div>';
                } else if (data[i].content.length && !data[i].images.length) { //if only content available
                    tabContents = '<div class="row"><div class="col-sm-12">' + createContentHtml(data, i) + '</div></div>';
                }
            } else { // if tabs are inactive only add tab names
                template = template + '<li role="presentation"><a href="#" class="tabs" data-id="' + "tab-" + i + '">' + data[i].name + '</a></li>';
            }
        }

        var finalTemplate = template + '</ul>' + tabContents;
        $("#viewport").html(finalTemplate);

        $('.tabs').on('click', function() { //initialize listners for tab click to replace view contents
            replaceViewportContents($(this).data('id').split('-')[1], data);
        });

        $('.searchIcon').on('click', function() { //initialize listners for search icon click to get image path
            currentModalImage = $(this).data('src');
            $('#image-modal').modal('show');
        });
    }

    $('#image-modal').on('show.bs.modal', function(event) { // listners for modal open
        $('#imageport').html('<img src="' + currentModalImage + '" style="width: 100%;">'); // append selected image
    });

    function replaceViewportContents(index, data) {
        data.map(function(x) {
            x.active = false;
        });
        data[index].active = true;
        displayContentsOnViewport(data);
    }


    function createContentHtml(data, index) { // generate html for contents
        var temp = "<p>";
        for (var j = 0, len = data[index].content.length; j < len; j++) {
            temp = temp + data[index].content[j] + '</p>';
        }
        return temp;
    }

    function createImageHtml(data, index) { // generate html for images
        var temp = "";
        for (var j = 0, len = data[index].images.length; j < len; j++) {
            temp = temp + '<div class="imageContainer"><img class="thumbnail" src="' + data[index].images[j] + '"><img class="searchIcon" data-src="' + data[index].images[j] + '" src="./images/search.png"></div>';
        }
        return temp;
    }
});
