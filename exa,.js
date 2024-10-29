const fs = require('fs');
const path = require('path');
const BigInt = require('big-integer');
function convertFromBase(num, base) {
    if (base <= 10) {
        return BigInt(parseInt(num, base));
    }
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let res = BigInt(0);
    let power = BigInt(1);
    
    for (let i = num.length - 1; i >= 0; i--) {
        const digit = digits.indexOf(num[i].toLowerCase());
        res = res.add(BigInt(digit).multiply(power));
        power = power.multiply(BigInt(base));
    }
    
    return res;
}
function lagrangeInterpolation(points, k) {

    const x = BigInt(0);
    let res = BigInt(0);

    for (let i = 0; i < k; i++) {
        let term = points[i].y;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const num = x.subtract(points[j].x);

                const den = points[i].x.subtract(points[j].x);
                
                term = term.multiply(num).divide(den);
            }
        }
        
        res = res.add(term);
    }
    
    return res;
}
function processTestCase(data) {
    const { n, k } = data.keys;
    const points = [];
    

    for (let i = 1; i <= n; i++) {
        const point = data[i];
        if (point) {
            points.push({
                x: BigInt(i),
                y: convertFromBase(point.value, parseInt(point.base))
            });
        }
    }
    
    const selectedPoints = points.slice(0, k);
    
    const secret = lagrangeInterpolation(selectedPoints, k);
    
    return secret.toString();
}


function readJsonFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        process.exit(1);
    }
}
function processAllTestCases() {

    const inp = readJsonFile('input.json');

    console.log(processTestCase(inp));
}

if (!fs.existsSync('input.json')) {
    console.error("no input file");
    process.exit(1);
}


processAllTestCases();