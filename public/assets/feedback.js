
function onReportSubmit() {
    var content_ID = $('#report-content-dialog .reported-content').attr('content_ID');
    var report_url = $('#report-this-url').text();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: report_url,
        data: {content_ID: content_ID},
        success: function(data) {
            $('#report-content-dialog .report-dialog-content').html(data.message).show();
            if(!data.OK) {
                $('#report-content-dialog .report-dialog-content').addClass('error');
            }
        },
        error: function(data) {
                document.open();
                document.write(data.responseText);
                document.close();
        },
        complete: function(data) {
            $('#report-content-dialog .spinner').hide();
        }
    });
    $('#report-content-dialog .report-dialog-content').hide();
    $('#report-content-dialog .spinner').show();
}

$(document).ready(function(eventObject) {
    var report_label = $('#report-this-label').text();
    $('.reportable').each(function(){
        if($(this).attr('content_ID') != 0) {
            $(this).append(
                "<div class='report-this overlay-trigger' rel='#report-content-dialog'>" + report_label + "</div>"
            ).hover(function(){$(this).find('.report-this').show();},
                   function(){$(this).find('.report-this').hide();}
            );
        }
    });

    $('.report-this').click(function(){
        // Copy the reported content into the #report-content-dialog
        var content = $(this).parent('.reportable').clone();
        content.find('.report-this').remove();
        $('#report-content-dialog .reported-content').html(content.html()).attr('content_ID', content.attr('content_ID'));
    });

    $('#report-content-dialog input').click(onReportSubmit);
});
