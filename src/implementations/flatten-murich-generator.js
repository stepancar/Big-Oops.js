var doFlat = (
    function* ( theArr ) {
        var theValue;
        var doIsArray = Array.isArray;
        for (theValue of theArr) {
            if (doIsArray(theValue)) {
                yield* doFlat(theValue);
            } else {
                yield theValue;
            }
        }
    }
)

var flatten = (
    ( theArr ) => {
        return [...doFlat(theArr)];
    }
)
