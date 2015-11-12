///<reference path="./d3.d.ts" />
// Сюда мы пишем просто вспомогательные функции, которые нам не нужны в других местах

    function maxWordLength(string) {
        var maxLength = 0;
        var lateIndex = 0;
        for (var i = 0; i < string.length; i++) {
            if (string[i] === " " || (i === (string.length - 1))) {
                if ((i - lateIndex) > maxLength) maxLength = i - lateIndex;
                lateIndex = i;
            }
        }
        return maxLength;
    }

    export function getFontSize(stringLength, maxStringNumber, text) {
        var longestWord = maxWordLength(text);
        var textLength = text.length;
        return Math.round(Math.min(((stringLength * maxStringNumber) / textLength), (stringLength / longestWord)));
    }

    export function excludeSpaces(string) {
        var output = "";
        for (var i = 0; i < string.length; i++) {
            if (string[i] != " " && string[i] != "&") output += string[i]
        }
        return output;
    }

    export function ringGenerator(innerR, outerR) {
        return d3.svg.arc()
            .outerRadius(outerR)
            .innerRadius(innerR)
            .startAngle(0)
            .endAngle(2 * Math.PI);
    }

    export function arcGenerator(outerR) {
        return d3.svg.arc()
            .outerRadius(outerR)
            .innerRadius(0);
    }

    export function pieGenerator() {
        return d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d;
            });
    }