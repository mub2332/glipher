$(function () {
    var url;
    var maxtime;
    var currentStart;
    var currentEnd;

    function convertTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        return { minutes, seconds };
    }

    function formatSeconds(seconds) {
        return seconds < 10 ? "0" + seconds : seconds;
    }

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        url = tabs[0].url;
        chrome.tabs.sendMessage(
            tabs[0].id,
            { type: "load" },
            { frameId: 0 },
            function (response) {
                maxtime = response.max;
                currentStart = parseInt(response.current);
                currentEnd = parseInt(currentStart + 5);

                $("#start").attr("min", "0");
                $("#start").attr("value", currentStart);
                $("#start").attr("max", currentEnd - 1);

                $("#end").attr("min", "0");
                $("#end").attr("value", currentEnd);
                $("#end").attr("max", maxtime);

                var currentStartTime = convertTime(currentStart);
                var currentStartMinutes = currentStartTime.minutes;
                var currentStartSeconds = currentStartTime.seconds;

                var currentEndTime = convertTime(currentEnd);
                var currentEndMinutes = currentEndTime.minutes;
                var currentEndSeconds = currentEndTime.seconds;

                $("#startText").text(
                    currentStartMinutes +
                        " : " +
                        formatSeconds(currentStartSeconds)
                );
                $("#endText").text(
                    currentEndMinutes + " : " + formatSeconds(currentEndSeconds)
                );
            }
        );
    });

    $("#start").on("input change", function () {
        currentStart = $(this).val();

        var currentTime = convertTime(currentStart);
        var currentMinutes = currentTime.minutes;
        var currentSeconds = currentTime.seconds;

        $("#startText").text(
            currentMinutes +
                " : " +
                (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds)
        );
    });

    $("#end").on("input change", function () {
        currentEnd = $(this).val();

        var currentTime = convertTime(currentEnd);
        var currentMinutes = currentTime.minutes;
        var currentSeconds = currentTime.seconds;

        if (currentStart >= currentEnd) {
            currentStart = currentEnd - 1;
            if (currentStart < 0) currentStart = 0;
            var currentStartTime = convertTime(currentStart);
            var currentStartMinutes = currentStartTime.minutes;
            var currentStartSeconds = currentStartTime.seconds;
            $("#start").attr("value", currentStart);
            $("#startText").text(
                currentStartMinutes + " : " + formatSeconds(currentStartSeconds)
            );
        }

        $("#start").attr("max", currentEnd - 1);
        $("#endText").text(
            currentMinutes +
                " : " +
                (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds)
        );
    });

    $("#createGIF").click(function () {
        alert(url);
        alert(currentStart);
        alert(currentEnd);
        alert(maxtime);
    });
});
