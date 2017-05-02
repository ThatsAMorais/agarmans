var utils = require('./utils')

/*
 * Get anagrams for a word.
 * Currently only supports single-word anagrams
 */
exports.get = function(req, res) {
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

                // Clip the result to the limit
                if(limit > 0) {
                    anagrams = anagrams.slice(0, limit)
                }
            }
            res.status(200).json({'anagrams': anagrams})
        })
}

/*
 * Deletes a word and its anagrams
 */
exports.delete = function(req, res) {
    // Remove the entire document from the collection corresponding to this word
    db.collection('anagrams').remove({key: utils.getWordKey(req.params.word)})
    res.sendStatus(204)
}
