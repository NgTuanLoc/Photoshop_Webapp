function benchmark( func ) {
    var startT = new Date();
    func();
    var endT = new Date();
    console.log('time cost = ' + (endT - startT) + 'ms');
}