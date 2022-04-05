const assembleString = a =>  [...Array((a[0] || []).length).keys()].map(i => a.map(s => s[i]).filter(c => c != '*')[0] || '#').join('')

console.log(assembleString(['a*cde','*bcde','abc*e']));


