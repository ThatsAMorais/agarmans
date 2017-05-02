var utils = require('./utils')

exports.read = function(req, res) {
    var limit = req.query.limit
    db.collection('anagrams').findOne(
        {key: utils.getWordKey(req.params.word)},
        function(err, result) {
            var anagrams = []
            if(result) {
                // Filter out the word being searched from the list
                anagrams = result.words.filter(function(word) {
                    return 0 != word.localeCompare(req.params.word)
                })

                // TODO: Calculate multi-word anagrams

                // Clip the result to the limit
                if(limit > 0) {
                    anagrams = anagrams.slice(0, limit)
                }
            }
            res.status(200).json({'anagrams': anagrams})
        })
}
