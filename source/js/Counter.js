function showTime(Counter) {
    var visiors = $(".leancloud_visitors");
    visiors.each(function () {
        var url = $(this).attr("id").trim();
        var query = new AV.Query(Counter);
        query.equalTo("url", url);
        query.find({
            success: function (results) {
                if (results.length == 0) {
                    var content = '0 ' + $(document.getElementById(url)).text();
                    $(document.getElementById(url)).text(content);
                    return;
                }
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var content = object.get('time') + ' ' + $(document.getElementById(url)).text();
                    $(document.getElementById(url)).text(content);
                }
            },
            error: function (object, error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

    });
}

function addCount(Counter) {
    var Counter = AV.Object.extend("Counter");
    url = $(".leancloud_visitors").attr('id').trim();
    title = $(".leancloud_visitors").attr('data-flag-title').trim();

    var query = new AV.Query(Counter);
    query.equalTo("url", url);
    query.find({
        success: function (results) {
            // 如果命中，浏览数+1
            if (results.length > 0) {
                var counter = results[0];
                counter.fetchWhenSave(true);
                counter.increment("time");
                counter.save(null, {
                    success: function (counter) {
                        var content = counter.get('time') + ' ' + $(document.getElementById(url)).text();
                        $(document.getElementById(url)).text(content);
                    },
                    error: function (counter, error) {
                        var content = counter.get('time') + ' ' + $(document.getElementById(url)).text();
                        $(document.getElementById(url)).text(content);
                    }
                });
            } else {
            // 没有命中，新建counter项
                var newcounter = new Counter();
                newcounter.set("title", title);
                newcounter.set("url", url);
                newcounter.set("time", 1);
                newcounter.save(null, {
                    success: function (newcounter) {
                        var content = newcounter.get('time') + ' ' + $(document.getElementById(url)).text();
                        $(document.getElementById(url)).text(content);
                    },
                    error: function (newcounter, error) {
                        console.log('Failed to create');
                    }
                });
            }
        },
        error: function (error) {
            console.log('Error:' + error.code + " " + error.message);
        }
    });
}
$(function () {
    var Counter = AV.Object.extend("Counter");
    if ($('.leancloud_visitors').length == 1) {
        addCount(Counter);
    } else if ($('.post-title-link').length >= 1) {
        showTime(Counter);
    }
});
