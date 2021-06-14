const convert = function (pm25) {
    switch (true) {
        case pm25 < 12:
            return 1
        case pm25 < 24:
            return 2
        case pm25 < 36:
            return 3
        case pm25 < 42:
            return 4
        case pm25 < 48:
            return 5
        case pm25 < 54:
            return 6
        case pm25 < 59:
            return 7
        case pm25 < 65:
            return 8
        case pm25 < 71:
            return 9
        case pm25 > 72:
            return 10
        default:
            return 0
    }
}

export default convert
