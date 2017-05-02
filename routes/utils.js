

exports.getWordKey = function(word) {
    return word.toLowerCase().split('').sort().join('')
}

