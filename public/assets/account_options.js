$(document).ready(function()
{
    function hideAccountOptions()
    {
        // hide the list.
        $("#account-details").hide();
        $("#account-header-mask").hide();
        $("#account-header").removeClass("selected");
    }
    function showAccountOptions()
    {
        $("#account-details").show();
        $("#account-header-mask").show();
        $("#account-header").addClass("selected");
    }

    $("#account-header").click(function(event)
    {
        if($('#account-details').is(':visible'))
        {
            hideAccountOptions();
        }
        else
        {
            // We're not showing this list. Show it.
            showAccountOptions();
            // Set up a handler to dismiss if the user clicks outside the list.
            $('html').click(function(event)
            {
                hideAccountOptions();
            });
            // Catch the user clicking on the list to prevent the previous handler firing.
            $("#account-details").click(function(event)
            {
                event.stopPropagation();
            });
        }
        // Stop the event continuing to fire and interfering with the above handlers.
        event.stopPropagation();
    });
});

