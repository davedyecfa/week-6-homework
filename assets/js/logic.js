$(document).ready(function(){
    var giphy = {

        topics: ["arrested development", "futurama",
            "it's always sunny in philiadelphia", "fargo", "ghost in the shell", 
            "30 rock", "chappelle show", "mr. show",                  
            "run ronnie run", "trailer park boys", "zach galifinakis", 
            "howl's moving castle", "spirited away", "minority report"
         ],
        
        // Set button for a topic.
        setButton: function (button) {
            function build(topic) {
                var newButton = $("<button>");

                newButton
                    .attr("type", "button")
                    .addClass("btn anime")
                    .text(topic.toLowerCase());
                
                $("#animeButtons").append(newButton);
            }
            return build(button);
        },

        // Set topic if not current topic, empty string, or string of spaces.
        setTopics: function () {
            $("#animeButtons").empty();
            $("#anime-input").val("");
            for (var topicIndex = 0; topicIndex < giphy.topics.length; topicIndex++) {
                var button = giphy.topics[topicIndex];
                giphy.setButton(button);
            }
        },

        // Get API data for topic.
        getInfo: function (topic) {
            $("#results").empty();
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/search?q=" + topic + "&limit=10&api_key=dc6zaTOxFJmzC",
                method: "GET",
            }).done(function(response) {
                giphy.apiData = response.data;
                gifToDom(giphy.apiData);
            });

            // Loop through each gif object and call setDom on each.
            function gifToDom(data) {
                for (var item = 0; item < data.length; item++) {
                    var thumbnail = data[item].images.fixed_height_still.url;
                    var gif = data[item].images.fixed_height.url;
                    var rating = data[item].rating;

                    giphy.setDom(thumbnail, gif, rating, item);
                }
            }   
        },

        // Set DOM elements for a gif.
        setDom: function (image, gif, rating) {
            var newGif = $("<div>");

            // Set rating DOM element.
            function setRating(rating) {
                var ratElement = $("<p>");
                ratElement.text("Rating: " + rating);
                newGif.append(ratElement);
            }

            // Set image DOM element.
            function setImage(img, gif) {
                var imgElement = $("<img>");

                imgElement
                    .addClass("imgs")
                    .attr("src", img)
                    .attr("data-state", "still")
                    .attr("data-still", img)
                    .attr("data-animate", gif);
                
                newGif.append(imgElement);
            }

            // Set element to DOM.
            function setElement() {
                newGif.addClass("gifs");
                $("#results").append(newGif);
                setRating(rating);
                setImage(image, gif);
            }

            setElement();
        }
    }

    giphy.setTopics();

    // Prevents enter key press from reloading page.
    $(window).keydown(function(event){
        if (event.keyCode == 13) {
            $("#addAnime").click();
            return false;
        }
    });

    // Push new topic to array and get API data for it when pushing Submit
    $("#addAnime").on("click", function () {
        var newItem = $("#anime-input").val();
        if (giphy.topics.indexOf(newItem) == -1 && newItem != "" && jQuery.trim(newItem).length != 0) {
            giphy.topics.push(newItem);
            
            giphy.setTopics();
            giphy.getInfo(newItem);
        }
    });

    // Get API data when pressing a topic button
    $("#animeButtons").on("click", ".anime", function () {
        var currentTopic = $(this).text().replace(/ /g, '+');
        giphy.getInfo(currentTopic);
    });

    // Get gif index and image source when clicking a gif
    $("#results").on("click", ".gifs .imgs", function () {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });
});