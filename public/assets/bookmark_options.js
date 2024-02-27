$(document).ready(function()
{
    function hideBookmarkOptions()
    {
        // hide the list.
        $("#bookmark-details").hide();
        $("#bookmark-header").removeClass("selected");
    }
    function showBookmarkOptions()
    {
        $("#bookmark-details").show();
        $("#bookmark-header").addClass("selected");
    }

    $("#bookmark-header").click(function(event)
    {
        if($('#bookmark-details').is(':visible'))
        {
            hideBookmarkOptions();
        }
        else
        {
            // We're not showing this list. Show it.
            showBookmarkOptions();
            // Set up a handler to dismiss if the user clicks outside the list.
            $('html').click(function(event)
            {
                hideBookmarkOptions();
            });
            // Catch the user clicking on the list to prevent the previous handler firing.
            $("#bookmark-details").click(function(event)
            {
                event.stopPropagation();
            });
        }
        // Stop the event continuing to fire and interfering with the above handlers.
        event.stopPropagation();
    });
});

