// https://leetcode.com/problems/subarray-sum-equals-k/


var doCalc = (
    (theTarget, theLimit) => {
       var theSumma = 0;
        var theRes = (
 
           theTarget.reduceRight(
              (theRes, theCur) => {
 
                  theRes.push(0)
 
               return (
                  theRes.map((theEl) => {
 
                       var theSum;
 
                       return (
 
                            (((theSum=(theEl+theCur))===theLimit) && (theSumma++), theSum)
                        )
                  })
               )
            }
           )
        )
        return theRes;
    }
 )