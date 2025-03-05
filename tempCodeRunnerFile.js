app.get('/html/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', req.params.filename));
});