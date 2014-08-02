module.exports = function(app) {
    
    app.get('/', function (req, res) {
        res.send('<h1>Welcome to supersmooth</h1>')
    })
    
    app.get('*', function (req, res) {
        res.status(404).send('<h1>page not found</h1')
    })
    
}