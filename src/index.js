import $ from 'jquery';
require('@fortawesome/fontawesome-free/js/all');


const meetup = 'https://api.meetup.com/pugbo-grusp/events?callback=?&sign=true&photo-host=secure&page=1&has_ended=false';
var titolo = $('<h5 class="card-title">');
var corpo = $('<div class="card-body">');

$(function(){
    $.getJSON(meetup, function(d) {
        console.log(d.data[0]);
        if (d.data.length > 0) {
            var disponibili = d.data[0].rsvp_limit / d.data[0].yes_rsvp_count;

            var giorno = new Date(d.data[0].local_date).toLocaleDateString('it-IT',{
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            $('<a>').text(d.data[0].name).attr('href',d.data[0].link).appendTo(titolo);
            $('<p>').text(giorno +' ore '+ d.data[0].local_time).appendTo(corpo);
            $('<p>').text('Presso: '+d.data[0].venue.name + ', ' + d.data[0].venue.address_1 + ' - ' + d.data[0].venue.city).appendTo(corpo);
            $('<p class="card-text">').html(d.data[0].description).appendTo(corpo);
            $('<button>').attr({
                'href': d.data[0].link,
                'id': 'partecipa',
                'class': 'btn btn-lg',
                'role': 'button',
            }).text('Partecipa').appendTo(corpo);
            $(titolo).prependTo(corpo);
            $(corpo).appendTo('#evento');

            if (disponibili <= 1) {
                $('#partecipa').addClass('btn-danger').text('Al completo, entra in lista d’attesa');
            } else if (disponibili < 2 ) {
                $('#partecipa').addClass('btn-warning').text('Ultimi posti disponibili');
            } else {
                $('#partecipa').addClass('btn-success');
            }
        } else {
            $('#evento').remove();
            $('#claim').addClass('center-screen');
        }
    })
    .fail(function(err){
        $('#evento').remove();
        $('#claim').addClass('center-screen');
        console.error(err);
    })
});
