const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

const MAX_WIDTH = (window.innerWidth)/2 - window.innerWidth * 0.1;
const MAX_HEIGHT = (window.innerHeight) - window.innerHeight * .4;


canvas1.width = MAX_WIDTH;
canvas1.height = MAX_HEIGHT;

canvas2.width = MAX_WIDTH;
canvas2.height = MAX_HEIGHT;

const width = canvas1.width;
const height = canvas1.height;

const numBars = 100;
const barWidthUnit = width * (1 / numBars);
const barHeightUnit = height * (1 / numBars);

ctx1.imageSmoothingEnabled = true;
ctx1.fillStyle = "black";

ctx2.imageSmoothingEnabled = true;
ctx2.fillStyle = "black";

let speed = 10;

const algoTitles = ["Bubble Sort","Insertion Sort", "Selection Sort", "Merge Sort", "Quick Sort"];

let globalStop = false;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ****************************************************************
// Class Definition of Screen *************************************
// ****************************************************************
class Screen {
    constructor(canvas, algoIndex, ctx, title) {
        this.canvas = canvas;
        this.algoIndex = algoIndex;
        this.ctx = ctx;
        this.heights = new Array(numBars);
        this.title = title;
        this.algoFunctions = [bubbleSort, insertionSort, selectionSort, mergeSort, quickSort]; 
        this.newBars();
        this.drawBars();
    }

    nextAlgoTitle() {
        this.algoIndex++;
        if(this.algoIndex == algoTitles.length){
            this.algoIndex = 0;
        }
        document.getElementById(this.title).innerHTML = "Current Sorting: "+ algoTitles[this.algoIndex];
    }

    prevAlgoTitle() {
        this.algoIndex--;
        if(this.algoIndex < 0){
            this.algoIndex = algoTitles.length - 1;
        }
        document.getElementById(this.title).innerHTML = "Current Sorting: "+ algoTitles[this.algoIndex];
    }

    runAlgoFunction() {
        if(!globalStop)        
            if(this.algoIndex == algoTitles.length){
                this.algoIndex = 0;
            }
            else if(this.algoIndex == 3 || this.algoIndex == 4)
                this.algoFunctions[this.algoIndex](this, this.heights);
            else
                this.algoFunctions[this.algoIndex](this, this.heights);
    }

    newBars() {
        this.heights = [];
        let rand = Math.floor(Math.random() * numBars);
        for(let i = 0; i < numBars; i++) {
            if(!this.heights.includes(rand)) {
                this.heights.push(rand);
            }
            else
                i -= 1;
            rand = Math.floor(Math.random() * numBars);
        }
    }

    drawBars() {
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "black";
        for(let i = 0; i < numBars; i++) {
            this.ctx.fillRect(barWidthUnit * this.heights[i], height - barHeightUnit * i - barHeightUnit , barWidthUnit, barHeightUnit + barHeightUnit * i)
        }
    }

    drawBars2(val1, val2) {
        this.ctx.clearRect(0, 0, width, height);
        for(let i = 0; i < numBars; i++) {
            this.ctx.fillStyle = "black";
            if(i == val1 || i == val2) {
                this.ctx.fillStyle = "red";
                this.ctx.fillRect(barWidthUnit * this.heights[i],height-barHeightUnit * i - barHeightUnit, barWidthUnit,barHeightUnit + barHeightUnit* i);
            }
            else
                this.ctx.fillRect(barWidthUnit * this.heights[i],height-barHeightUnit * i - barHeightUnit , barWidthUnit,barHeightUnit + barHeightUnit* i);

        }
    }


}
// ***********************************************************
// Sorting Algorithms ****************************************
// ***********************************************************

async function insertionSort(currScreen) {
    for (let i = 1; i < currScreen.heights.length; i++) {
        if(globalStop) return;
        let current = currScreen.heights[i];
        let j = i - 1;
        while (j >= 0 && currScreen.heights[j] > current) {
            currScreen.heights[j + 1] = currScreen.heights[j];
            j--;
            currScreen.drawBars2(i, j);
            await wait(speed);
        }
        currScreen.heights[j + 1] = current;
    }
    currScreen.drawBars();
}

async function bubbleSort(currScreen) {
    for(let i = 0; i < numBars; i++) {
        if(globalStop) return;
        for(let j = i + 1; j < numBars; j++) {
        
        if(currScreen.heights[i] > currScreen.heights[j]) {
            [currScreen.heights[i], currScreen.heights[j]] = [currScreen.heights[j], currScreen.heights[i]];
        }
        if(globalStop) return;
        currScreen.drawBars2(i, j);
        await wait(speed);
        }
    }
    
    currScreen.drawBars();
    console.log("Done!");
    }

async function selectionSort(currScreen) {
    if(globalStop) return;
    const len = currScreen.heights.length;
    for (let i = 0; i < len - 1; i++) {
        if(globalStop) return;
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if(globalStop) return;
            if (currScreen.heights[j] < currScreen.heights[minIndex]) {
                minIndex = j;
            }
            currScreen.drawBars2(i, j);
            await wait(speed);
        }
        if (minIndex !== i) {
            [currScreen.heights[i], currScreen.heights[minIndex]] = [currScreen.heights[minIndex], currScreen.heights[i]];
        }
    }
    currScreen.drawBars();
}

async function mergeSort(currScreen, arr, start = 0, end = arr.length - 1) {
    if(globalStop) return;
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(currScreen, arr, start, mid);
        await mergeSort(currScreen, arr, mid + 1, end);
        await merge(currScreen, arr, start, mid, end);
    }
    currScreen.drawBars();
}

async function merge(currScreen, arr, start, mid, end) {
    if(globalStop) return;
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);
    let leftIndex = 0;
    let rightIndex = 0;
    for (let i = start; i <= end; i++) {
            if(globalStop) return;
            if (leftIndex >= leftArr.length) {
                arr[i] = rightArr[rightIndex];
                rightIndex++;
            } 
            else if (rightIndex >= rightArr.length) {
                arr[i] = leftArr[leftIndex];
                leftIndex++;
            } 
            else if (leftArr[leftIndex] < rightArr[rightIndex]) {
                arr[i] = leftArr[leftIndex];
                leftIndex++;
            } 
            else {
                arr[i] = rightArr[rightIndex];
                rightIndex++;
            }
            currScreen.drawBars2(currScreen.heights.indexOf(leftArr[leftIndex]), currScreen.heights.indexOf(rightArr[rightIndex]));
            await wait(speed);
        }
}


async function quickSort(currScreen, arr, start = 0, end = arr.length - 1) {
    if(globalStop) return;
    if (start < end) {
        const pivotIndex = await partition(currScreen, arr, start, end);
        await quickSort(currScreen, arr, start, pivotIndex - 1);
        await quickSort(currScreen, arr, pivotIndex + 1, end);
    }
    currScreen.drawBars();
}

async function partition(currScreen, arr, start, end) {
    const pivotValue = arr[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        if(globalStop) return;
        if (arr[i] < pivotValue) {
        await swap(currScreen, arr, i, pivotIndex);
        pivotIndex++;
        }
    }
    await swap(currScreen, arr, end, pivotIndex);
    return pivotIndex;
}

async function swap(currScreen, arr, i, j) {
    if(globalStop) return;
    currScreen.drawBars2(currScreen.heights.indexOf(arr[i]), currScreen.heights.indexOf(arr[j]));
    await wait(speed);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

  

// ***********************************************************
// Initial Start *********************************************
// ***********************************************************

Screen1 = new Screen(canvas1, 0, ctx1, "currAlgoTxt1");
Screen2 = new Screen(canvas2, 0, ctx2, "currAlgoTxt2");



// ***********************************************************
// Buttons ***************************************************
// ***********************************************************

document.getElementById("nextBtn1").addEventListener("click", function() {
    Screen1.nextAlgoTitle();
});
document.getElementById("prevBtn1").addEventListener("click", function() {
    Screen1.prevAlgoTitle();
});
document.getElementById("nextBtn2").addEventListener("click", function() {
    Screen2.nextAlgoTitle();
});
document.getElementById("prevBtn2").addEventListener("click", function() {
    Screen2.prevAlgoTitle();
});

document.getElementById("sort").addEventListener("click", async function() {
    globalStop = false;
    Screen1.runAlgoFunction();
    Screen2.runAlgoFunction();
});

document.getElementById("refresh").addEventListener("click", function() {
    Screen1.newBars();
    Screen1.drawBars();

    Screen2.newBars();
    Screen2.drawBars();

    globalStop = true;
});