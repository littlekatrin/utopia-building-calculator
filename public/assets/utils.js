/* A single global namespace under which to add all Arcadia Games functions and vars. */

var ag = {
    config: {
        showErrorsInPopup: true,
        showErrorsInCurrentWindow: false,
        showErrorsInConsole: true,
    },
    setup: function(spec) {
        // override defaults with spec
        $.extend(ag.config, spec);
    },
    reportError: function(errorContent) {
        // Shows a popup window containing error response content
        if (ag.config.showErrorsInPopup)
        {
            // window.open(url, windowName, features, replace)
            popupWindow = window.open('','name','height=800,width=600,scrollbars=yes,menubar=yes,location=yes');
            var doc = popupWindow.document;
            doc.write(errorContent);
            doc.close();
        }

        // Replace the current window with the error content
        if (ag.config.showErrorsInCurrentWindow)
        {
            document.open();
            document.write(errorContent);
            document.close();
        }

        // Output the error content to the javascript console
        if (ag.config.showErrorsInConsole)
        {
            console.log(errorContent);
        }
    },
}

function goBack() {
    window.history.back();
}
