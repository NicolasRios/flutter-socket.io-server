const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('ACDC'));
bands.addBand( new Band('Safadão'));

console.log(bands)

io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands() );

    client.on('disconnect', () => { console.log('Cliente desconectado') });

    client.on('mensagem', ( payload )=>{
        console.log('Mensagem!!', payload);

        io.emit('mensagem', {admin: 'Nova Mensagem'});
    });

    client.on('vote-band', (payload) => {

        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
        
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
        
    });

    client.on('delete-band', (payload) => {

        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
        
    });

    // client.on('nova-mensagem', (payload) => {
    //     // io.emit('nova_mensagem', payload);
    //     client.broadcast.emit('nova-mensagem', payload );
    // });

  });
