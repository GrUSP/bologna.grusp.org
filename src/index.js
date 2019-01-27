import $ from 'jquery';
import Unsplash, { toJson } from 'unsplash-js';
require('@fortawesome/fontawesome-free/js/all');

const unsplash = new Unsplash({
    applicationId: "5d73355c273ab8dce93f9f0a7be063ae2a6e0802abc98c86545b0c02a17c15da",
    secret: "3c707b81c0a8fd37ce629e5302ba765b337bb06275fff9618e4f8ba91f1e3f8f",
    // applicationId: '15fd22fa11dad9d908a8d50c8876535910484ff5c35d4ef27dfe14bd824c82e4',
    // secret: 'dd66a9700e4fdcfbeb2b5ebc457dd0626042d88a54a66e59ebc6c02a232ca8da',
    // callbackUrl: "{CALLBACK_URL}",
});

const meetup = 'https://api.meetup.com/pugbo-grusp/events?callback=?&sign=true&photo-host=secure&page=1&has_ended=false';
var titolo = $('<h5 class="card-title">');
var corpo = $('<div class="card-body">');

$(document).ready(function(){

    unsplash.photos.getRandomPhoto({ query: "meeting"}).then(toJson).then(json => {
        console.log(json);
        $('body').css('background-color', json.color);
        $('body').css('background-image', 'url('+json.urls.regular+')');
    }).catch(err => {
        console.error(err);
    });

    $.getJSON(meetup, function(d) {
        console.log(d.data[0]);
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
        // $('<p>').html('<a id="partecipa" class="btn btn-lg" role="button" href="'++'">Partecipa!</a>').appendTo(corpo);
        $(titolo).prependTo(corpo);
        $(corpo).appendTo('#evento');

        if (disponibili <= 1) {
            $('#partecipa').addClass('btn-danger').text('Al completo, entra in lista d’attesa');
        } else if (disponibili < 2 ) {
            $('#partecipa').addClass('btn-warning').text('Ultimi posti disponibili');
        } else {
            $('#partecipa').addClass('btn-success');
        }
    })
    .fail(function(err){
        console.error(err);
    })
});
