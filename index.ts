import { Layout, Plot, clear, plot, stack } from 'nodeplotlib';

const intervalScaneLength = 0.5;

const derivative = (data: number[]): {
    value: number;
    index: number;
} => {
    let length = data.length;
    const divs: number[] = [];
    for (let i = 1; i < length - 1; i++) {
        const dy = data[i + 1] - data[i - 1];
        const dx = 2;
        divs.push(dy / dx);
    }
    const step = Math.round(length * intervalScaneLength);
    let oldD = divs.slice(0, step).reduce((o, n) => o + n) / step;
    let index = 0;
    for (let i = 1; i < length - step; i += 1) {
        const curr_div = divs.slice(i, i + step).reduce((o, n) => o + n) / step;
        if (curr_div >= oldD) {
            oldD = curr_div;
            index = i;
        }
    }
    return {
        value: oldD,
        index: index
    };
}

const derivative2 = (data: number[]): {
    value: number;
    index: number;
} => {
    let length = data.length;
    const divs: number[] = [];
    for (let i = 0; i < length - 1; i++) {
        const dy = data[i + 1] - data[i];
        const dx = 1;
        divs.push(dy / dx);
    }
    const step = Math.floor(length * intervalScaneLength);
    let oldD = divs.slice(0, step).reduce((o, n) => o + n) / step;
    let index = 0;
    for (let i = 1; i < length - step; i += 1) {
        const curr_div = divs.slice(i, i + step).reduce((o, n) => o + n) / step;
        if (curr_div >= oldD) {
            oldD = curr_div;
            index = i;
        }
    }
    return {
        value: oldD,
        index: index
    };
}

const derivative3 = (data: number[]): {
    value: number;
    index: number;
} => {
    let length = data.length;
    const divs: number[] = [];
    for (let i = 1; i < length; i++) {
        const dy = data[i] - data[i - 1];
        const dx = 1;
        divs.push(dy / dx);
    }
    const step = Math.floor(length * intervalScaneLength);
    let oldD = divs.slice(0, step).reduce((o, n) => o + n) / step;
    let index = 0;
    for (let i = 1; i < length - step; i += 1) {
        const curr_div = divs.slice(i, i + step).reduce((o, n) => o + n) / step;
        if (curr_div >= oldD) {
            oldD = curr_div;
            index = i;
        }
    }
    return {
        value: oldD,
        index: index
    };
}

const array: {
    [index: number]: {
        fun: string;
        score: {
            value: number;
            index: number;
        };
        score2: {
            value: number;
            index: number;
        };
        score3: {
            value: number;
            index: number;
        };
        row: number[];
    }
} = {};

const funs = [
    Math.clz32,
    Math.sign,
    Math.log10,
    Math.log2,
    Math.log1p,
    Math.expm1,
    Math.cosh,
    Math.sinh,
    Math.tanh,
    Math.acosh,
    Math.asinh,
    Math.atanh,
    Math.trunc,
    Math.fround,
    Math.cbrt,
    Math.abs,
    Math.acos,
    Math.asin,
    Math.atan,
    Math.ceil,
    Math.cos,
    Math.exp,
    Math.floor,
    Math.log,
    Math.round,
    Math.sin,
    Math.sqrt,
    Math.tan,
];

const xLength = 50;
const plotsNumber = funs.length;
const ran: boolean = true;

for (let i = 0; i < plotsNumber; i++) {
    const row: number[] = [];
    for (let j = 0; j < xLength; j++) {
        const rand = ran ? Math.random() : 1;
        row[j] = rand * funs[i](j);
    }

    const obj: {
        fun: string;
        score: {
            value: number;
            index: number;
        };
        score2: {
            value: number;
            index: number;
        };
        score3: {
            value: number;
            index: number;
        };
        row: number[];
    } = {
        fun: funs[i].name,
        row: row,
        score: derivative(row),
        score2: derivative2(row),
        score3: derivative3(row),
    };
    array[i] = obj;
}

const sorted = Object.values(array).sort((a, b) => b.score.value - a.score.value).sort((a, b) => b.score.index - a.score.index);
const sorted2 = Object.values(array).sort((a, b) => b.score2.value - a.score2.value).sort((a, b) => b.score2.index - a.score2.index);
const sorted3 = Object.values(array).sort((a, b) => b.score3.value - a.score3.value).sort((a, b) => b.score3.index - a.score3.index);

const x1 = Object.keys(sorted);
const x2 = Object.keys(sorted2);
const x3 = Object.keys(sorted3);
const y1 = Object.values(sorted).map(v => v.score.value);
const y2 = Object.values(sorted2).map(v => v.score2.value);
const y3 = Object.values(sorted3).map(v => v.score3.value);
const z1 = Object.values(sorted).map(v => v.score.index);
const z2 = Object.values(sorted2).map(v => v.score2.index);
const z3 = Object.values(sorted3).map(v => v.score3.index);


stack([{
    x: x1,
    y: y1,
    z: z1,
    name: 'Scores',
    // type: 'scatter3d',
},
{
    x: x2,
    y: y2,
    z: z2,
    name: 'Scores2',
    // type: 'scatter3d',
},
// {
//     x: x3,
//     y: y3,
//     z: z3,
//     name: 'Scores3',
//     type: 'scatter3d',
// }
], {
    title: 'Scores',
});



Object.keys(array).forEach(i => {
    const obj = sorted[Number(i)];
    const obj2 = sorted2[Number(i)];
    const obj3 = sorted2[Number(i)];
    const title = obj.fun + '\n' + i.toString() + '\n' + JSON.stringify(obj.score) + '\n' + JSON.stringify(obj.score2);
    const title2 = obj2.fun + '\n' + i.toString() + '\n' + JSON.stringify(obj2.score) + '\n' + JSON.stringify(obj2.score2);
    const title3 = obj3.fun + '\n' + i.toString() + '\n' + JSON.stringify(obj3.score) + '\n' + JSON.stringify(obj3.score2);
    stack([{
        x: Array.from(obj.row.keys()),
        y: obj.row,
        name: title,
    }, {
        x: Array.from(obj2.row.keys()),
        y: obj2.row,
        name: title2,
        xaxis: 'x2',
        yaxis: 'y2',
    },
    {
        x: Array.from(obj3.row.keys()),
        y: obj3.row,
        name: title3,
        xaxis: 'x3',
        yaxis: 'y3',
    },
    ], {
        title: title,
        "xaxis.title": "",
        xaxis: { domain: [0, 1 / 3] },
        yaxis2: { anchor: 'x2' },
        xaxis2: { domain: [1 / 3,  2 / 3] },
        yaxis3: { anchor: 'x3' },
        xaxis3: { domain: [2 / 3, 1] }
    });
});

plot();
